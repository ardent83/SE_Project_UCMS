import { useState } from 'react';
import { useFormik } from 'formik';
import { authValidationSchema } from '../validation/authValidationSchema';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';


const useAuthForm = () => {
    const { login, register } = useAuth();
    const [formType, setFormType] = useState('login');
    const [apiError, setApiError] = useState(null);

    const initialValues = {
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        roleId: 2,
    };

    const formik = useFormik({
        initialValues,
        validationSchema: authValidationSchema(formType),
        onSubmit: async (values, { setSubmitting }) => {
            setApiError(null);
            setSubmitting(true);
            try {
                if (formType === 'login') {
                    await login(values.email, values.password);
                } else {
                    await register(values.username, values.email, values.password, values.confirmPassword, values.roleId);
                }
            } catch (err) {
                setApiError(err.message || (formType === 'login' ? 'ورود ناموفق' : 'ثبت‌نام ناموفق'));
            } finally {
                setSubmitting(false);
            }
        },
    });

    const handleToggleForm = (newFormType) => {
        setFormType(newFormType);
        setApiError(null);
        formik.resetForm();
    };

    return { formik, formType, apiError, handleToggleForm };
};

export default useAuthForm;
