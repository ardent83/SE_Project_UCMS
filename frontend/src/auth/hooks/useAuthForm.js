import { useState, useRef, useEffect, useCallback } from 'react';
import { useFormik } from 'formik';
import { authValidationSchema } from '../validation/authValidationSchema';
import { useAuth } from '../context/AuthContext';

const initialValues = {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    roleId: 2,
    tempCode: '',
};

const useAuthForm = () => {
    const { login, register, sendPasswordResetEmail, verifyPasswordResetCode } = useAuth();
    const [formType, setFormType] = useState('login');
    const [apiError, setApiError] = useState(null);
    const [tempPasswordStage, setTempPasswordStage] = useState('emailInput');
    const [timeLeft, setTimeLeft] = useState(0);
    const [resendButtonEnabled, setResendButtonEnabled] = useState(false);
    const timerIntervalRef = useRef(null);

    const clearTimer = () => {
        if (timerIntervalRef.current) {
            clearInterval(timerIntervalRef.current);
            timerIntervalRef.current = null;
        }
    };

    useEffect(() => {
        return () => clearTimer();
    }, []);

    const formik = useFormik({
        initialValues,
        validationSchema: authValidationSchema(formType, tempPasswordStage),
        onSubmit: async (values, { setSubmitting, resetForm }) => {
            setApiError(null);
            setSubmitting(true);
            try {
                if (formType === 'login') {
                    await login(values.email, values.password);
                } else if (formType === 'register') {
                    await register(values.username, values.email, values.password, values.confirmPassword, values.roleId);
                }
                resetForm({ values: { ...initialValues, roleId: 2 } });
            } catch (err) {
                const errorMessage = err.message || (formType === 'login' ? 'ورود ناموفق' : 'ثبت‌نام ناموفق');
                setApiError(errorMessage);
                console.error("Auth Error:", err);
            } finally {
                setSubmitting(false);
            }
        },
    });

    const startCountdownTimer = useCallback((duration = 120) => {
        clearTimer();
        setTimeLeft(duration);
        setResendButtonEnabled(false);

        timerIntervalRef.current = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearTimer();
                    setResendButtonEnabled(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    }, []);

    const resetTempPasswordFlow = useCallback(() => {
        setTempPasswordStage('emailInput');
        setTimeLeft(0);
        setResendButtonEnabled(false);
        clearTimer();
        formik.setFieldValue('email', '');
        formik.setFieldValue('tempCode', '');
        setApiError(null);
    }, [formik]);

    const handleToggleForm = useCallback((newFormType) => {
        setFormType(newFormType);
        setApiError(null);
        formik.resetForm({ values: { ...initialValues, roleId: 2 } });

        if (newFormType === 'tempPassword') {
            setTempPasswordStage('emailInput');
            setTimeLeft(0);
            setResendButtonEnabled(false);
            clearTimer();
        } else {
            resetTempPasswordFlow();
        }
    }, [formik, resetTempPasswordFlow]);
    
    const formatTime = useCallback((seconds) => {
        const m = String(Math.floor(seconds / 60)).padStart(2, '0');
        const s = String(seconds % 60).padStart(2, '0');
        return `${m}:${s}`;
    }, []);

    const handleResendCode = async (email) => {
        if (!resendButtonEnabled) return;

        setApiError(null);
        formik.setSubmitting(true);
        try {
            await sendPasswordResetEmail(email);
            setApiError('کد تأیید جدید ارسال شد.');
            startCountdownTimer();
        } catch (err) {
            const errorMessage = err.message || 'خطا در ارسال مجدد کد.';
            setApiError(errorMessage);
            console.error("[useAuthForm] Error resending code:", err);
        } finally {
            formik.setSubmitting(false);
        }
    };

    const handleSendTempPasswordEmail = async (email) => {
        setApiError(null);
        formik.setSubmitting(true);
        try {
            await sendPasswordResetEmail(email);
            setApiError('کد تأیید به ایمیل شما ارسال شد.');
            setTempPasswordStage('codeVerification');
            formik.setFieldValue('email', email);
            formik.setFieldValue('tempCode', '');
            startCountdownTimer();
            return true;
        } catch (err) {
            const errorMessage = err.message || 'خطا در ارسال ایمیل. لطفا دوباره تلاش کنید.';
            setApiError(errorMessage);
            console.error("[useAuthForm] Error sending temp password email:", err);
            return false;
        } finally {
            formik.setSubmitting(false);
        }
    };

    const handleVerifyTempPasswordCode = async (email, code) => {
        setApiError(null);
        formik.setSubmitting(true);
        try {
            await verifyPasswordResetCode(email, code);
            setApiError('رمز عبور با موفقیت تأیید شد. لطفاً رمز عبور جدید خود را تنظیم کنید.');
            setFormType('login');
            resetTempPasswordFlow();
            formik.resetForm({ values: { ...initialValues, roleId: 2 } });
            return true;
        } catch (err) {
            const errorMessage = err.message || 'کد تأیید نامعتبر است. لطفا دوباره تلاش کنید.';
            setApiError(errorMessage);
            console.error("[useAuthForm] Error verifying temp password code:", err);
            return false;
        } finally {
            formik.setSubmitting(false);
        }
    };

    return {
        formik,
        formType,
        apiError,
        handleToggleForm,
        tempPasswordStage,
        handleSendTempPasswordEmail,
        handleVerifyTempPasswordCode,
        resendCodeTimer: timeLeft,
        isResendEnabled: resendButtonEnabled,
        handleResendCode,
        formatTime,
        resetTempPasswordFlow
    };
};

export default useAuthForm;