import React, { useEffect, useRef, useState } from "react";
import InputBox from "./components/InputBox";
import InfoText from "./components/InfoText";
import RoleSelector from "./components/RoleSelector";
import Alert from '../components/Alert'
import AuthForm from "./components/AuthForm";
import useAuthForm from "./hooks/useAuthForm";
import "./auth-page.css";

export default function AuthPage() {
    const { formik, formType, apiError, handleToggleForm } = useAuthForm();
    const wrapperRef = useRef(null);
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');

    useEffect(() => {
        if (wrapperRef.current) {
            if (formType === 'register') {
                wrapperRef.current.classList.add("active");
            } else {
                wrapperRef.current.classList.remove("active");
            }
        }

        if (apiError) {
            setAlertMessage(apiError);
            setShowAlert(true);
        } else {
            setShowAlert(false);
            setAlertMessage('');
        }
    }, [formType, apiError]);

    const handleCloseAlert = () => {
        setShowAlert(false);
        setAlertMessage('');
    };

    return (
        <div className="wrapper" ref={wrapperRef}>
            {showAlert && (
                <Alert message={alertMessage} onClose={handleCloseAlert} />
            )}
            <span className="rotate-bg"></span>
            <span className="rotate-bg2"></span>

            <AuthForm type="login">
                <h2 className="title animation" style={{ "--i": 0, "--j": 21 }}>ورود</h2>
                <form onSubmit={formik.handleSubmit}>
                    <InputBox type="text" label="نام کاربری" icon="bxs-user" i={1} j={22} field={formik.getFieldProps('username')} form={formik} />
                    <InputBox type="password" label="گذرواژه" icon="bxs-lock-alt" i={2} j={23} field={formik.getFieldProps('password')} form={formik} />
                    <button type="submit" className="btn animation" style={{ "--i": 3, "--j": 24 }} disabled={formik.isSubmitting}>ورود</button>
                    <div className="linkTxt animation" style={{ "--i": 5, "--j": 25 }}>
                        <p>حساب کاربری ندارید؟ <a href="#" className="register-link" onClick={() => handleToggleForm('register')}>ثبت‌نام</a></p>
                    </div>
                    <div className="forgatLink animation" style={{ "--i": 6, "--j": 26 }}>
                        <a href="#">رمز عبور خود را فراموش کرده‌اید؟</a>
                    </div>
                </form>
            </AuthForm>
            <InfoText type="login" i={0} j={20} />

            <AuthForm type="register">
                <h2 className="title animation" style={{ "--i": 17, "--j": 0 }}>ثبت‌نام</h2>
                <form onSubmit={formik.handleSubmit}>
                    <InputBox type="text" label="نام کاربری" icon="bxs-user" i={18} j={1} field={formik.getFieldProps('username')} form={formik} />
                    <InputBox type="email" label="پست الکترونیک" icon="bxs-envelope" i={19} j={2} field={formik.getFieldProps('email')} form={formik} />
                    <InputBox type="password" label="گذرواژه" icon="bxs-lock-alt" i={20} j={3} field={formik.getFieldProps('password')} form={formik} />
                    <InputBox type="password" label="تأیید گذرواژه" icon="bxs-lock-alt" i={21} j={4} field={formik.getFieldProps('confirmPassword')} form={formik} />
                    <RoleSelector
                        value={formik.values.roleId}
                        onChange={(e) => formik.setFieldValue('roleId', Number(e.target.value))}
                        i={22} j={5}
                    />
                    <button type="submit" className="btn animation" style={{ "--i": 24, "--j": 7 }} disabled={formik.isSubmitting}>ثبت‌نام</button>
                    <div className="linkTxt animation" style={{ "--i": 25, "--j": 8 }}>
                        <p>حساب کاربری دارید؟ <a href="#" className="login-link" onClick={() => handleToggleForm('login')}>ورود</a></p>
                    </div>
                </form>
            </AuthForm>
            <InfoText type="register" i={17} j={0} />
        </div>
    );
}
