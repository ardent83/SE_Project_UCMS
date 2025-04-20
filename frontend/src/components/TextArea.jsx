import React, { useState, forwardRef } from "react";
import classNames from "classnames";
import {
    theme,
    getLabelClasses,
    getAsteriskColor,
    getInputClasses,
    getErrorMessageClasses,
} from "./Theme";

const TextArea = forwardRef(({
    label,
    text = "",
    className,
    disabled = false,
    dir = "rtl",
    value,
    openCalendar,
    mustFill = false,
    handleValueChange,
    field,
    form,
    rows = 4,
    cols = 50,
    ...props
}, ref) => {
    const hasError = form.touched[field.name] && form.errors[field.name];

    const [isFocused, setIsFocused] = useState(false);
    const [placeholder, setPlaceholder] = useState(text);

    return (
        <label className={classNames(classNames(theme.baseClasses.labelContainer, className), "h-fit")}>
            <div className={classNames(theme.baseClasses.labelWrapper, {
                [getLabelClasses(theme, isFocused, disabled, hasError)]: true,
            })}>
                {mustFill && (
                    <div className={classNames(theme.baseClasses.asterisk, getAsteriskColor(theme, disabled, hasError))}>
                        *
                    </div>
                )}
                <span className={getLabelClasses(theme, isFocused, disabled, hasError)}>
                    {label}
                </span>
            </div>
            <div className={theme.baseClasses.selectContainer}>
                <textarea
                    ref={ref}
                    {...field}
                    {...props}
                    className={classNames(getInputClasses(theme, isFocused, disabled, hasError, dir), "h-full")}
                    value={value}
                    onFocus={() => {
                        setIsFocused(true);
                        setPlaceholder("");
                    }}
                    onBlur={(e) => {
                        field.onBlur(e);
                        setIsFocused(false);
                        setPlaceholder(text);
                    }}
                    onChange={(e) => {
                        field.onChange(e);
                        handleValueChange?.(e, e.target.value);
                    }}
                    placeholder={text ? placeholder : ""}
                    disabled={disabled}
                    dir={dir}
                    rows={rows}
                    cols={cols}
                />
            </div>

            {hasError && (
                <span className={getErrorMessageClasses(theme)}>
                    {form.errors[field.name]}
                </span>
            )}
        </label>
    );
});

export default TextArea;
