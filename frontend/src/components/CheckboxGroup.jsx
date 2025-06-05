import React from 'react';
import classNames from "classnames";
import {
    theme,
    getLabelClasses,
    getErrorMessageClasses,
    checkboxClasses,
} from "./Theme";

export default function CheckboxGroup({
    label,
    options,
    form,
    fieldName,
    disabled,
    className,
    ...props
}) {
    const value = form.values[fieldName] || [];
    const touched = form.touched[fieldName];
    const hasError = (form ? form.touched[fieldName] && form.errors[fieldName] : false);

    const handleCheckboxChange = (event) => {
        const { value: checkboxValue, checked } = event.target;
        const currentFormats = form.values[fieldName] || [];

        let newFormats;
        if (checked) {
            if (!currentFormats.includes(checkboxValue)) {
                newFormats = [...currentFormats, checkboxValue];
            } else {
                newFormats = currentFormats;
            }
        } else {
            newFormats = currentFormats.filter(item => item !== checkboxValue);
        }

        form.setFieldValue(fieldName, newFormats);
    };




    return (
        <div className={`relative w-full flex flex-col items-end gap-2 ${className}`} {...props}>
            <label className={getLabelClasses(theme, false, disabled, hasError)}>{label}</label>
            <div className="w-full max-w-full justify-end flex flex-wrap gap-4">
                {options.map(option => (
                    <label
                        key={option.id}
                        className={classNames(
                            "peer-disabled:cursor-not-allowed flex justify-center items-center gap-1 text-neutralgray-6",
                            {
                                "opacity-50 cursor-not-allowed": disabled,
                                "text-error-1": touched && !!hasError
                            }
                        )}
                    >
                        <input
                            type="checkbox"
                            name={fieldName}
                            value={option.id}
                            checked={value.includes(option.id)}
                            onChange={handleCheckboxChange}
                            className={checkboxClasses(touched, hasError)}
                            disabled={disabled || form.isSubmitting}
                            onBlur={form.handleBlur}
                        />
                        <span className="peer-disabled:cursor-not-allowed text-body-04 peer-checked:text-big-stone-00">{option.name}</span>
                    </label>
                ))}
            </div>

            {hasError && (
                <span className={getErrorMessageClasses(theme)}>
                    {form.errors[fieldName]}
                </span>
            )}
        </div>
    );
}
