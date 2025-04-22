import * as Yup from "yup";

export const passwordValidationSchema = () =>
  Yup.object({
    oldPassword: Yup.string().required("گذرواژه فعلی الزامی است"),
    newPassword: Yup.string()
      .required("گذرواژه جدید الزامی است")
      .min(8, "گذرواژه جدید باید حداقل ۸ کاراکتر باشد")
      .matches(/[a-z]/, "گذرواژه جدید باید حداقل یک حرف کوچک داشته باشد")
      .matches(/[A-Z]/, "گذرواژه جدید باید حداقل یک حرف بزرگ داشته باشد")
      .matches(/\d/, "گذرواژه جدید باید حداقل یک عدد داشته باشد")
      .matches(
        /[@$!%*?&]/,
        "گذرواژه جدید باید حداقل یک کاراکتر خاص (@$!%*?&) داشته باشد"
      ),
    confirmNewPassword: Yup.string()
      .required("تکرار گذرواژه جدید الزامی است")
      .oneOf(
        [Yup.ref("newPassword"), null],
        "تکرار گذرواژه جدید با گذرواژه جدید مطابقت ندارد"
      ),
  });
