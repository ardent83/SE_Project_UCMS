import * as Yup from 'yup';

export const authValidationSchema = (formType) => Yup.object({
    username: Yup.string().required('نام کاربری الزامی است'),
    email: Yup.string().email('ایمیل نامعتبر است').when([], {
        is: () => formType === 'register',
        then: () => Yup.string().required('ایمیل الزامی است'),
        otherwise: () => Yup.string().email('ایمیل نامعتبر است'),
    }),
    password: Yup.string()
        .required('گذرواژه الزامی است')
        .min(6, 'گذرواژه باید حداقل ۶ کاراکتر باشد'),
    confirmPassword: Yup.string().when([], {
        is: () => formType === 'register',
        then: () => Yup.string()
            .required('تکرار گذرواژه الزامی است')
            .oneOf([Yup.ref('password'), null], 'تکرار گذرواژه با گذرواژه مطابقت ندارد'),
    }),
});
