import { useState } from 'react';
import { useFormik } from 'formik';
import { classFormValidationSchema } from '../validation/accountSettingsValidationSchema';
import { submitClassForm } from '../utils/accountSettingsApi'

const useClassForm = (props) => {
    const [apiError, setApiError] = useState(null);

    const initialValues = {
        ...props
    }

    const formik = useFormik({
        initialValues,
        validationSchema: classFormValidationSchema(),
        onSubmit: async (values, { setSubmitting }) => {
            setApiError(null);
            setSubmitting(true);
            try {
                const response = await submitClassForm(values)
                if (response.ok) {
                    const data = await response.json();
                    return true;
                } else {
                    const errorData = await response.json();
                    throw new Error(errorData.message);
                }
            } catch (err) {
                setApiError(err.message || '!خطایی رخ داد');
            } finally {
                setSubmitting(false);
            }
        },
    });

    return { formik, apiError };
};

export default useClassForm;
