import React, { useEffect, useRef, useState } from "react";
import InputBox from "./components/InputBox";
import InfoText from "./components/InfoText";
import RoleSelector from "./components/RoleSelector";
import Alert from '../components/Alert';
import AuthForm from "./components/AuthForm";
import useAuthForm from "./hooks/useAuthForm";
import "./auth-page.css";
import { useNavigate } from "react-router-dom";

export default function AuthPage() {
    const {
        formik,
        formType,
        apiError,
        handleToggleForm,
        tempPasswordStage,
        handleSendTempPasswordEmail,
        handleVerifyTempPasswordCode,
        resendCodeTimer,
        isResendEnabled,
        handleResendCode,
        formatTime,
    } = useAuthForm();

    const navigate = useNavigate();
    const wrapperRef = useRef(null);
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [previousFormType, setPreviousFormType] = useState(formType);

    useEffect(() => {
        if (formType === 'register' || formType === 'tempPassword') {
            setPreviousFormType(formType);
            if (wrapperRef.current) {
                setTimeout(() => {
                    wrapperRef.current.classList.add("active");
                }, 100);
            }
        } else {
            if (wrapperRef.current) {
                wrapperRef.current.classList.remove("active");
            }
        }

        if (apiError) {
            setTimeout(() => {
                setAlertMessage(apiError);
                setShowAlert(true);
            }, 0);
        } else {
            setTimeout(() => {
                setShowAlert(false);
                setAlertMessage('');
            }, 0);
        }
    }, [formType, apiError]);

    const handleCloseAlert = () => {
        setShowAlert(false);
        setAlertMessage('');
    };

    const handleTempPasswordSubmit = async (e) => {
        e.preventDefault();
        formik.validateForm().then(async (errors) => {
            if (Object.keys(errors).length === 0) {
                if (tempPasswordStage === 'emailInput') {
                    await handleSendTempPasswordEmail(formik.values.email);
                } else if (tempPasswordStage === 'codeVerification') {
                    const verified = await handleVerifyTempPasswordCode(formik.values.email, formik.values.tempCode);
                    if (verified)
                        navigate('/dashboard');
                }
            } else {
                formik.setErrors(errors);
            }
        });
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
                    <InputBox type="email" label="پست الکترونیک" icon="bxs-envelope" i={1} j={22} field={formik.getFieldProps('email')} form={formik} />
                    <InputBox type="password" label="گذرواژه" icon="bxs-lock-alt" i={2} j={23} field={formik.getFieldProps('password')} form={formik} />
                    <button type="submit" className="btn animation" style={{ "--i": 3, "--j": 24 }} disabled={formik.isSubmitting}>ورود</button>
                    <div className="linkTxt animation" style={{ "--i": 5, "--j": 25 }}>
                        <p>حساب کاربری ندارید؟ <a href="#" className="register-link" onClick={() => handleToggleForm('register')}>ثبت‌نام</a></p>
                    </div>
                    <div className="forgatLink animation" style={{ "--i": 6, "--j": 26 }}>
                        <a href="#" onClick={() => handleToggleForm('tempPassword')}>رمز عبور خود را فراموش کرده‌اید؟</a>
                    </div>
                </form>
            </AuthForm>
            <InfoText type="login" i={0} j={20} />

            {previousFormType === 'tempPassword' ? (
                <>
                    <AuthForm type="tempPassword">
                        <h2 className="title animation" style={{ "--i": 17, "--j": 0 }}>دریافت رمز عبور موقت</h2>
                        <form onSubmit={handleTempPasswordSubmit}>
                            {tempPasswordStage === 'emailInput' && (
                                <>
                                    <InputBox
                                        type="email"
                                        label="پست الکترونیک"
                                        icon="bxs-envelope"
                                        i={18} j={1}
                                        field={formik.getFieldProps('email')}
                                        form={formik}
                                    />
                                    <button
                                        type="submit"
                                        className="btn animation"
                                        style={{ "--i": 19, "--j": 2 }}
                                        disabled={formik.isSubmitting}
                                    >
                                        ارسال ایمیل
                                    </button>
                                </>
                            )}
                            {tempPasswordStage === 'codeVerification' && (
                                <>
                                    <div className="code-input-wrapper animation" style={{ "--i": 18, "--j": 1 }}>
                                        <div className="timer-display">
                                            <span className="timer-countdown">{formatTime(resendCodeTimer)}</span>
                                        </div>
                                        <InputBox
                                            type="text"
                                            label="کد تأیید"
                                            icon="bxs-lock-alt"
                                            field={formik.getFieldProps('tempCode')}
                                            form={formik}
                                            className="temp-code-input-box"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="btn animation"
                                        style={{ "--i": 20, "--j": 3 }}
                                        disabled={formik.isSubmitting}
                                    >
                                        تأیید
                                    </button>
                                    {resendCodeTimer === 0 && (
                                        <div className="resend-link animation" style={{ "--i": 21, "--j": 4 }}>
                                            <a href="#" onClick={(e) => {
                                                e.preventDefault();
                                                handleResendCode(formik.values.email);
                                            }} disabled={!isResendEnabled}>
                                                ارسال مجدد کد
                                            </a>
                                        </div>
                                    )}
                                </>
                            )}
                            <div className="linkTxt animation" style={{ "--i": 20, "--j": 3 }}>
                                <p>حساب کاربری دارید؟ <a href="#" className="login-link" onClick={() => {
                                    handleToggleForm('login');
                                }}>ورود</a></p>
                            </div>
                        </form>
                    </AuthForm>
                    <InfoText type="tempPassword" i={17} j={0} />
                </>
            ) : (
                <>
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
                                <p>حساب کاربری دارید؟ <a href="#" className="login-link" onClick={() => {
                                    handleToggleForm('login');
                                }}>ورود</a></p>
                            </div>
                        </form>
                    </AuthForm>
                    <InfoText type="register" i={17} j={0} />
                </>
            )}
        </div>
    );
}