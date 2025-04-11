import React from "react";

const AuthForm = ({ type, children }) => (
    <div className={`form-box ${type}`}>
        {children}
    </div>
);

export default AuthForm;
