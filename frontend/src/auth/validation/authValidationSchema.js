import * as Yup from 'yup';

export const authValidationSchema = (formType) => Yup.object({
    username: Yup.string()
        .required('نام کاربری الزامی است')
        .matches(
            /^[a-zA-Z0-9]+$/,
            'نام کاربری فقط می‌تواند شامل حروف انگلیسی و اعداد باشد'
        ),
    email: Yup.string().email('ایمیل نامعتبر است').when([], {
        is: () => formType === 'register',
        then: () => Yup.string().required('ایمیل الزامی است'),
        otherwise: () => Yup.string().email('ایمیل نامعتبر است'),
    }),
    password: Yup.string()
        .required('گذرواژه الزامی است')
        .min(8, 'گذرواژه باید حداقل ۸ کاراکتر باشد')
        .matches(
            /[a-z]/,
            'گذرواژه باید حداقل یک حرف کوچک داشته باشد'
        )
        .matches(
            /[A-Z]/,
            'گذرواژه باید حداقل یک حرف بزرگ داشته باشد'
        )
        .matches(
            /\d/,
            'گذرواژه باید حداقل یک عدد داشته باشد'
        )
        .matches(
            /[@$!%*?&]/,
            'گذرواژه باید حداقل یک کاراکتر خاص (@$!%*?&) داشته باشد'
        )
        .matches(
            /^[a-zA-Z0-9@$!%*?&]+$/,
            'گذرواژه شامل حروف انگلیسی می‌تواند باشد'
        ),
    confirmPassword: Yup.string().when([], {
        is: () => formType === 'register',
        then: () => Yup.string()
            .required('تکرار گذرواژه الزامی است')
            .oneOf([Yup.ref('password'), null], 'تکرار گذرواژه با گذرواژه مطابقت ندارد'),
    }),
});
