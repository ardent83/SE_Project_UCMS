import * as Yup from "yup";

const dateFormatRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/;

export const allowedFormats = ["pdf", "zip", "rar", "txt"];

export const exerciseFormValidationSchema = (formType) =>
  Yup.object().shape({
    title: Yup.string()
      .required("عنوان تکلیف الزامی است")
      .min(1, "عنوان تکلیف حداقل باید ۱ کاراکتر باشد")
      .max(200, "عنوان تکلیف حداکثر می‌تواند ۲۰۰ کاراکتر باشد"),

    startDate: Yup.string()
      .required("تاریخ و زمان شروع تکلیف الزامی است")
      .test(
        "dateFormat",
        "فرمت تاریخ و زمان شروع نامعتبر است (مثال: YYYY/MM/DD HH:mm:ss)",
        (value) => {
          if (value === null || value === "") return true;
          return dateFormatRegex.test(value);
        }
      ),

    endDate: Yup.string()
      .required("تاریخ و زمان پایان تکلیف الزامی است")
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

    exerciseScore: Yup.number()
      .required("نمره تکلیف الزامی است")
      .min(0, "نمره تکلیف نمی‌تواند کمتر از ۰ باشد")
      .max(1000, "نمره تکلیف نمی‌تواند بیشتر از ۱۰۰۰ باشد")
      .typeError("نمره تکلیف باید یک عدد باشد"),

    exerciseFile: Yup.mixed()
      .nullable()
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

        const allowedMimeTypes = [
          "application/pdf",
          "application/zip",
          "application/x-rar-compressed",
          "text/plain",
        ];

        const allowedExtensions = ["pdf", "zip", "rar", "txt"];

        if (value.type && allowedMimeTypes.includes(value.type)) {
          return true;
        }

        const fileName =
          typeof value === "string"
            ? value.toLowerCase()
            : typeof value.name === "string"
            ? value.name.toLowerCase()
            : "";
        return allowedExtensions.some((ext) => fileName.endsWith(`.${ext}`));
      }),

    fileFormats: Yup.array()
      .of(Yup.string())
      .min(1, "انتخاب حداقل یک فرمت فایل نهایی الزامی است")
      .required("انتخاب فرمت فایل نهایی الزامی است")
      .test(
        "isValidFormat",
        "فرمت فایل نهایی انتخاب شده نامعتبر است",
        (value) => {
          if (!value) return true;
          const isValid = value.every((format) =>
            allowedFormats.includes(format)
          );
          return isValid;
        }
      ),
  });
