import * as Yup from "yup";

export const generalSettingsValidationSchema = () =>
  Yup.object({
    firstName: Yup.string().required("نام الزامی است"),
    lastName: Yup.string().required("نام خانوادگی الزامی است"),
    gender: Yup.number()
        .required("جنسیت الزامی است")
        .oneOf([0, 1], "جنسیت نامعتبر است"),
    address: Yup.string().required("آدرس الزامی است"),
    bio: Yup.string(),
    dateOfBirth: Yup.string().required("تاریخ تولد الزامی است"),
  });
