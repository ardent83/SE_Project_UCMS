import React, { useState } from "react";
import classNames from "classnames";
import { ArrowDown2 } from 'iconsax-react';
import {
    theme,
    getAsteriskColor,
    getIconClasses,
    getLabelClasses,
    getSelectClasses,
    getErrorMessageClasses,
} from './Theme';

const Dropdown = React.forwardRef(({
    label,
    options = [],
    className,
    disabled = false,
    mustFill = false,
    field,
    form,
    ...props
}, ref) => {
    const hasError = form.touched[field.name] && form.errors[field.name];

    const [isFocused, setIsFocused] = useState(false);

    const currentValue = field.value === null || field.value === undefined ? '' : field.value;

    return (
        <label
            className={classNames(theme.baseClasses.labelContainer, className)}
        >
            <div className={classNames(theme.baseClasses.labelWrapper,
                getAsteriskColor(theme, disabled, hasError)
                )}>
                {mustFill && <div className={classNames(theme.baseClasses.asterisk, getAsteriskColor(theme, disabled, hasError))}>*</div>}
                <span className={classNames(getLabelClasses(theme, isFocused, disabled, hasError))}>
                    {label}
                </span>
            </div>

            <div className={theme.baseClasses.selectContainer}>
                <select
                    ref={ref}
                    {...field}
                    {...props}
                    className={classNames(theme.baseClasses.select, getSelectClasses(theme, isFocused, disabled, hasError))}
                    value={currentValue}
                    onChange={(e) => {
                        field.onChange(e);
                    }}
                    onFocus={() => setIsFocused(true)}
                    onBlur={(e) => {
                        field.onBlur(e);
                        setIsFocused(false);
                    }}
                    disabled={disabled}
                >
                    <option value="" disabled>
                        انتخاب کنید
                    </option>
                    {options.map((option) => (
                        <option key={option.id} value={option.id}>
                            {option.name}
                        </option>
                    ))}
                </select>
                <ArrowDown2
                    className={classNames(theme.baseClasses.icon, getIconClasses(theme, isFocused, disabled, hasError))}
                    size={16}
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

export default Dropdown;
