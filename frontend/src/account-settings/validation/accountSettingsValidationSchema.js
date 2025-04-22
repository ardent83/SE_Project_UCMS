import * as Yup from "yup";

const dateRegex = /^(13|14)\d{2}\/(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])$/;

const toEnglishDigits = (str) => str.replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)));

export const classFormValidationSchema = () =>
  Yup.object({
    date: Yup.string()
      .transform((value) => toEnglishDigits(value))
      .matches(dateRegex, "تاریخ باید به صورت YYYY/MM/DD باشه و معتبر باشه")
      .required("تاریخ الزامیه"),
    studentNumber: Yup.string().matches()
  });