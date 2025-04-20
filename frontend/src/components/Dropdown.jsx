import React, { useState } from "react";
import classNames from "classnames";
import { ArrowDown2 } from 'iconsax-react';
import {theme, getAsteriskColor, getIconClasses, getLabelClasses, getSelectClasses} from './Theme'

export default function Dropdown({
    label,
    options = [],
    className,
    onChange,
    disabled = false,
    mustFill=false,
    errorMessage = "اطلاعات به درستی وارد نشده است",
}) {
    const [isFocused, setIsFocused] = useState(false);
    const [error, setError] = useState(false);
    const [value, setValue] = useState("");

    const validateInput = (inputValue) => {
        setError(inputValue.trim() === "");
    };

    return (
        <label
            className={classNames(theme.baseClasses.labelContainer, className)}
        >
            <div className={classNames(theme.baseClasses.labelWrapper,
                getAsteriskColor(theme, disabled, error)
                )}>
                {mustFill && <div className={classNames(theme.baseClasses.asterisk, getAsteriskColor(theme, disabled, error))}>*</div>}
                <span className={classNames(getLabelClasses(theme, isFocused, disabled, error))}>
                    {label}
                </span>
            </div>

            <div className={theme.baseClasses.selectContainer}>
                <select
                    className={classNames(theme.baseClasses.select, getSelectClasses(theme, isFocused, disabled, error))}
                    value={value}
                    onChange={(e) => {
                        setValue(e.target.value);
                        onChange?.(e);
                        validateInput(e.target.value);
                    }}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => {
                        setIsFocused(false);
                        validateInput(value);
                    }}
                    disabled={disabled}
                >
                    <option value="" disabled hidden>
                        انتخاب کنید
                    </option>
                    {options.map((option, index) => (
                        <option key={index} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
                <ArrowDown2
                    className={classNames(theme.baseClasses.icon, getIconClasses(theme, isFocused, disabled, error))}
                    size={16}
                />
            </div>

            {error && (
                <span className={classNames(theme.baseClasses.errorMessage, theme.colors.errorMessage.error)}>
                    {errorMessage}
                </span>
            )}
        </label>
    );
}
