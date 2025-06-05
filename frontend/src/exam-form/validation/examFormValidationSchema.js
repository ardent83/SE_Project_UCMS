import * as Yup from "yup";

const dateFormatRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/;

export const examFormValidationSchema = (formType) =>
  Yup.object().shape({
    title: Yup.string()
      .required("عنوان امتحان الزامی است")
      .min(1, "عنوان امتحان حداقل باید ۱ کاراکتر باشد")
      .max(200, "عنوان امتحان حداکثر می‌تواند ۲۰۰ کاراکتر باشد"),

    examLocation: Yup.string()
      .required("محل امتحان الزامی است")
      .min(1, "محل امتحان حداقل باید ۱ کاراکتر باشد")
      .max(200, "محل امتحان حداکثر می‌تواند ۲۰۰ کاراکتر باشد"),

    date: Yup.string()
      .required("تاریخ و زمان امتحان الزامی است")
      .test(
        "dateFormat",
        "فرمت تاریخ و زمان نامعتبر است (مثال: YYYY/MM/DD HH:mm:ss)",
        (value) => {
          if (value === null || value === "") return true;
          return dateFormatRegex.test(value);
        }
      ),

    examScore: Yup.number()
      .required("نمره امتحان الزامی است")
      .min(0, "نمره امتحان نمی‌تواند کمتر از ۰ باشد")
      .max(1000, "نمره امتحان نمی‌تواند بیشتر از ۱۰۰۰ باشد")
      .typeError("نمره امتحان باید یک عدد باشد"),
  });
