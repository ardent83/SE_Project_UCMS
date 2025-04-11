import React from "react";
import "boxicons/css/boxicons.min.css";

const InputBox = ({ field, form, type, label, icon, i, j, ...props }) => {
    const hasError = form.touched[field.name] && form.errors[field.name];

    return (
        <div className="input-box animation" style={{ '--i': i, '--j': j }}>
            <input
                type={type}
                {...field}
                {...props}
                className={hasError ? 'error-input' : ''}
                placeholder=" "
            />
            <label>{label}</label>
            <i className={`bx ${icon}`}></i>
            {hasError && <div className="error-message">{form.errors[field.name]}</div>}
        </div>
    );
};

export default InputBox;
