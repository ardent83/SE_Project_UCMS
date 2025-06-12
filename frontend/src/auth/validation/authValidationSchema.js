import * as Yup from "yup";

export const authValidationSchema = (formType, tempPasswordStage = 'emailInput') =>
  Yup.object({
    username: Yup.string().when([], {
      is: () => formType === "register",
      then: () =>
        Yup.string()
          .required("نام کاربری الزامی است")
          .matches(
            /^[a-zA-Z0-9]+$/,
            "نام کاربری فقط می‌تواند شامل حروف انگلیسی و اعداد باشد"
          ),
    }),
    email: Yup.string().required("ایمیل الزامی است").email("ایمیل نامعتبر است"),
    password: Yup.string()
      .when([], {
        is: () => formType === "register",
        then: () =>
          Yup.string()
            .required("گذرواژه الزامی است")
            .min(8, "گذرواژه باید حداقل ۸ کاراکتر باشد")
            .matches(/[a-z]/, "گذرواژه باید حداقل یک حرف کوچک داشته باشد")
            .matches(/[A-Z]/, "گذرواژه باید حداقل یک حرف بزرگ داشته باشد")
            .matches(/\d/, "گذرواژه باید حداقل یک عدد داشته باشد")
            .matches(
              /[@$!%*?&]/,
              "گذرواژه باید حداقل یک کاراکتر خاص (@$!%*?&) داشته باشد"
            )
            .matches(
              /^[a-zA-Z0-9@$!%*?&]+$/,
              "گذرواژه شامل حروف انگلیسی، اعداد و کاراکترهای خاص (@$!%*?&) می‌تواند باشد"
            ),
        otherwise: () =>
          Yup.string().notRequired(), // Password is not required for tempPassword (email input)
      }),
    confirmPassword: Yup.string().when([], {
      is: () => formType === "register",
      then: () =>
        Yup.string()
          .required("تکرار گذرواژه الزامی است")
          .oneOf(
            [Yup.ref("password"), null],
            "تکرار گذرواژه با گذرواژه مطابقت ندارد"
          ),
      otherwise: () =>
        Yup.string().notRequired(), // Not required for login or tempPassword
    }),
    roleId: Yup.number().when([], {
      is: () => formType === "register",
      then: () =>
        Yup.number()
          .oneOf([1, 2], "نقش نامعتبر است")
          .required("انتخاب نقش الزامی است"),
      otherwise: () =>
        Yup.number().notRequired(), // Not required for login or tempPassword
    }),
    // --- NEW: tempCode validation for tempPassword flow ---
    tempCode: Yup.string().when([], {
      is: () => formType === 'tempPassword' && tempPasswordStage === 'codeVerification',
      then: () =>
        Yup.string()
          .required('کد تأیید الزامی است')
          .length(6, 'کد تأیید 6 رقمی است'),
      otherwise: () =>
        Yup.string().notRequired(), // Not required in other stages/form types
    }),
  });