import { useState, useRef, useEffect, useCallback } from 'react';
import { useFormik } from 'formik';
import { authValidationSchema } from '../validation/authValidationSchema';
import { useAuth } from '../context/AuthContext';

const useAuthForm = () => {
    const { login, register, sendPasswordResetEmail, verifyPasswordResetCode } = useAuth();
    const [formType, setFormType] = useState('login');
    const [apiError, setApiError] = useState(null);

    const [tempPasswordStage, setTempPasswordStage] = useState('emailInput');
    
    const [timeLeft, setTimeLeft] = useState(0); 
    const [resendButtonEnabled, setResendButtonEnabled] = useState(false);
    const timerIntervalRef = useRef(null); 

    const initialValues = {
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        roleId: 2,
        tempCode: '',
    };

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

    useEffect(() => {
        if (timeLeft <= 0) {
            if (timerIntervalRef.current) {
                clearInterval(timerIntervalRef.current);
                timerIntervalRef.current = null;
            }
            setResendButtonEnabled(true);
            setTimeLeft(0);
            return;
        }

        if (!timerIntervalRef.current) {
            timerIntervalRef.current = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        }
        
        return () => {
            if (timerIntervalRef.current) {
                clearInterval(timerIntervalRef.current);
                timerIntervalRef.current = null;
            }
        };
    }, [timeLeft]);

    const formatTime = useCallback((seconds) => {
        const m = String(Math.floor(seconds / 60)).padStart(2, '0');
        const s = String(seconds % 60).padStart(2, '0');
        return `${m}:${s}`;
    }, []);

    const startCountdownTimer = useCallback((duration = 120) => {
        setTimeLeft(duration);
        setResendButtonEnabled(false);
        if (timerIntervalRef.current) {
            clearInterval(timerIntervalRef.current);
            timerIntervalRef.current = null;
        }
    }, []);

    const handleResendCode = async (email) => {
        if (!resendButtonEnabled) return;

        setApiError(null);
        formik.setSubmitting(true);
        try {
            console.log('[useAuthForm] Resending verification code to:', email);
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
        console.log(`[useAuthForm] Sending temp password email to: ${email}`);

        try {
            await sendPasswordResetEmail(email);

            console.log(`[useAuthForm] Email sent successfully for: ${email}`);
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
        console.log(`[useAuthForm] Verifying temp password code: ${code} for email: ${email}`);

        try {
            await verifyPasswordResetCode(email, code);

            console.log(`[useAuthForm] Code verified successfully for: ${email}`);
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

    const resetTempPasswordFlow = useCallback(() => {
        setTempPasswordStage('emailInput');
        setTimeLeft(0);
        setResendButtonEnabled(false);
        if (timerIntervalRef.current) {
            clearInterval(timerIntervalRef.current);
            timerIntervalRef.current = null;
        }
        formik.setFieldValue('email', '');
        formik.setFieldValue('tempCode', '');
        setApiError(null);
    }, [formik]);

    useEffect(() => {
        return () => {
            if (timerIntervalRef.current) {
                clearInterval(timerIntervalRef.current);
                timerIntervalRef.current = null;
            }
        };
    }, []);

    const handleToggleForm = useCallback((newFormType) => {
        setFormType(newFormType);
        setApiError(null);
        formik.resetForm({ values: { ...initialValues, roleId: 2 } });

        if (newFormType === 'tempPassword') {
            setTempPasswordStage('emailInput');
            setTimeLeft(0);
            setResendButtonEnabled(false);
            if (timerIntervalRef.current) {
                clearInterval(timerIntervalRef.current);
                timerIntervalRef.current = null;
            }
        } else {
            resetTempPasswordFlow();
        }
    }, [formik, initialValues, resetTempPasswordFlow]);


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
        formatTime
    };
};

export default useAuthForm;