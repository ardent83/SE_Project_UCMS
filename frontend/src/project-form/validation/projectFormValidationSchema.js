import * as Yup from "yup";

const dateFormatRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/;

export const projectFormValidationSchema = (formType) =>
  Yup.object().shape({
    title: Yup.string()
      .required("عنوان پروژه الزامی است")
      .min(1, "عنوان پروژه حداقل باید ۱ کاراکتر باشد")
      .max(200, "عنوان پروژه حداکثر می‌تواند ۲۰۰ کاراکتر باشد"),

    totalScore: Yup.number()
      .required("نمره کل الزامی است")
      .min(1, "نمره کل نمی‌تواند کمتر از ۱ باشد")
      .max(1000, "نمره کل نمی‌تواند بیشتر از ۱۰۰۰ باشد")
      .typeError("نمره کل باید یک عدد باشد"),

    projectType: Yup.number()
      .required("نوع پروژه الزامی است")
      .oneOf([0, 1], "نوع پروژه نامعتبر است"),

    groupSize: Yup.number()
      .required("تعداد اعضا کل الزامی است")
      .typeError("تعداد اعضا باید یک عدد باشد")
      .max(1000, "تعداد اعضا نمی‌تواند بیشتر از ۱۰۰۰ باشد")
      .when("projectType", {
        is: 1,
        then: (schema) =>
          schema.min(2, "تعداد اعضا برای پروژه گروهی باید بیشتر از ۱ باشد"),
        otherwise: (schema) =>
          schema.oneOf([1], "تعداد اعضا برای پروژه تکی باید ۱ باشد"),
      }),

    startDate: Yup.string()
      .required("تاریخ و زمان شروع پروژه الزامی است")
      .test(
        "dateFormat",
        "فرمت تاریخ و زمان شروع نامعتبر است (مثال: YYYY/MM/DD HH:mm:ss)",
        (value) => {
          if (value === null || value === "") return true;
          return dateFormatRegex.test(value);
        }
      ),

    endDate: Yup.string()
      .required("تاریخ و زمان پایان پروژه الزامی است")
      .test(
        "dateFormat",
        "فرمت تاریخ و زمان پایان نامعتبر است (مثال: YYYY/MM/DD HH:mm:ss)",
        (value) => {
          if (value === null || value === "") return true;
          return dateFormatRegex.test(value);
        }
      )
      .test(
        "isAfterStartDate",
        "تاریخ پایان باید بعد از تاریخ شروع باشد",
        function (endDateValue) {
          const { startDate } = this.parent;
          if (!startDate || !endDateValue) {
            return true;
          }
          const startDateObj = new Date(startDate);
          const endDateObj = new Date(endDateValue);

          return endDateObj > startDateObj;
        }
      ),

    description: Yup.string().max(
      1000,
      "توضیحات حداکثر می‌تواند ۱۰۰۰ کاراکتر باشد"
    ),

    projectFile: Yup.mixed()
      .notRequired()
      .test(
        "fileSize",
        "حجم فایل بیشتر از حد مجاز است (حداکثر 5MB)",
        (value) => {
          if (!value) return true;
          return value.size <= 5 * 1024 * 1024;
        }
      )
      .test("fileType", "فرمت فایل نامعتبر است", (value) => {
        if (!value) return true;
        return [
          "application/pdf",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "application/vnd.openxmlformats-officedocument.presentationml.presentation",
          "image/jpeg",
          "image/png",
          "image/gif",
          "text/plain",
        ].includes(value.type);
      }),
  });
