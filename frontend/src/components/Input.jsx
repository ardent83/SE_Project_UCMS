import React, { useState, forwardRef, useId } from "react";
import classNames from "classnames";
import { Eye, EyeSlash, Calendar1 } from "iconsax-react";
import {
    theme,
    getLabelClasses,
    getAsteriskColor,
    getInputClasses,
    getIconClasses,
    getErrorMessageClasses,
} from "./Theme";

const Input = forwardRef(({
    type = "text",
    textShow = true,
    label,
    text = "",
    className,
    disabled = false,
    dir = "rtl",
    value,
    openCalendar,
    mustFill = false,
    handleValueChange,
    onChangeFile,
    field,
    form,
    ...props
}, ref) => {
    const hasError = (form ? form.touched[field.name] && form.errors[field.name] : false);

    const [isFocused, setIsFocused] = useState(false);
    const [placeholder, setPlaceholder] = useState(text);
    const [isPasswordVisible, setIsPasswordVisible] = useState(type !== "password");
    
    const id = useId();

    return (
        <div className={classNames(theme.baseClasses.labelContainer, className)}> 
            <div className={classNames(theme.baseClasses.labelWrapper,
                {
                    [getLabelClasses(theme, isFocused, disabled, hasError)]: true,
                }
            )}
            >
                {mustFill && <div className={classNames(theme.baseClasses.asterisk, getAsteriskColor(theme, disabled, hasError))}>*</div>}
                
                <label htmlFor={id} className={getLabelClasses(theme, isFocused, disabled, hasError)}>
                    {label}
                </label>
            </div>
            <div className={theme.baseClasses.selectContainer}>
                <input
                    id={id}
                    ref={ref}
                    {...field}
                    {...props}
                    className={getInputClasses(theme, isFocused, disabled, hasError, dir)}
                    type={(isPasswordVisible && type === 'password') || type === 'date' ? "text" : type}
                    value={value}
                    onFocus={() => {
                        setIsFocused(true);
                        setPlaceholder("");
                    }}
                    onBlur={(e) => {
                        field?.onBlur?.(e); 
                        setIsFocused(false);
                        setPlaceholder(text);
                    }}
                    onChange={(e) => {
                        field?.onChange?.(e);
                        handleValueChange?.(e, e.target.value);
                        onChangeFile?.(e);
                    }}
                    onMouseEnter={() => {}}
                    placeholder={textShow ? placeholder : ""}
                    disabled={disabled}
                    dir={dir}
                />
                {type === "password" && (
                    <span
                        className="flex justify-center items-center w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer"
                        onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                    >
                        {isPasswordVisible ?
                            <EyeSlash className={classNames(theme.baseClasses.icon, getIconClasses(theme, isFocused, disabled, hasError))} variant="Outline" size={16} />
                            :
                            <Eye className={classNames(theme.baseClasses.icon, getIconClasses(theme, isFocused, disabled, hasError))} variant="Outline" size={16} />
                        }
                    </span>
                )}
                {type === "date" && (
                    <span
                        className="flex justify-center items-center w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                        onClick={openCalendar}
                    >
                        <Calendar1
                            size="16"
                            color="var(--color-neutralgray-5)"
                            variant="Outline"
                        />
                    </span>
                )}
            </div>

            {hasError && (
                <span className={getErrorMessageClasses(theme)}>
                    {form.errors[field.name]}
                </span>
            )}
        </div>
    );
});

export default Input;
