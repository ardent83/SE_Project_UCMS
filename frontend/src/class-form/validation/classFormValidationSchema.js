import * as Yup from "yup";

const timeFormatRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
const dateFormatRegex = /^\d{4}-\d{2}-\d{2}$/;

const timeStringToMinutes = (timeString) => {
  const [hours, minutes] = timeString.split(":").map(Number);
  return hours * 60 + minutes;
};

export const classFormValidationSchema = (formType) =>
  Yup.object().shape({
    title: Yup.string()
      .required("اسم کلاس الزامی است")
      .min(1, "اسم کلاس حداقل باید ۱ کاراکتر باشد")
      .max(100, "اسم کلاس حداکثر می‌تواند ۱۰۰ کاراکتر باشد"),
    description: Yup.string().max(
      500,
      "توضیحات حداکثر می‌تواند ۵۰۰ کاراکتر باشد"
    ),
    password: Yup.string().when([], {
      is: () => formType === "create",
      then: (schema) =>
        schema
          .required("رمز عبور کلاس الزامی است")
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
      otherwise: (schema) => schema.notRequired(),
    }),
    confirmPassword: Yup.string().when([], {
      is: () => formType === "create",
      then: (schema) =>
        schema
          .required("تکرار رمز عبور کلاس الزامی است")
          .oneOf(
            [Yup.ref("password"), null],
            "تکرار رمز عبور با رمز عبور مطابقت ندارد"
          ),
      otherwise: (schema) => schema.notRequired(),
    }),

    startDate: Yup.string()
      .required("تاریخ شروع کلاس الزامی است")
      .test(
        "dateFormat",
        "فرمت تاریخ شروع نامعتبر است (مثال: YYYY-MM-DD)",
        (value) => {
          return dateFormatRegex.test(value);
        }
      ),
    endDate: Yup.string()
      .required("تاریخ پایان کلاس الزامی است")
      .test(
        "dateFormat",
        "فرمت تاریخ پایان نامعتبر است (مثال: YYYY-MM-DD)",
        (value) => {
          return dateFormatRegex.test(value);
        }
      ),

    profileImage: Yup.mixed()
      .notRequired()
      .test(
        "fileSize",
        "حجم فایل تصویر پروفایل بیشتر از حد مجاز است",
        (value) => {
          if (!value || typeof value === "string") return true;
          return value.size <= 1 * 1024 * 1024;
        }
      )
      .test("fileType", "فرمت فایل تصویر پروفایل نامعتبر است", (value) => {
        if (!value || typeof value === "string") return true;
        return ["image/jpeg", "image/png", "image/gif"].includes(value.type);
      }),

    schedules: Yup.array()
      .min(1, "حداقل یک جلسه برای کلاس الزامی است")
      .of(
        Yup.object()
          .shape({
            id: Yup.number().optional(),
            classId: Yup.number().optional(),
            dayOfWeek: Yup.number()
              .required("روز هفته الزامی است")
              .oneOf([0, 1, 2, 3, 4, 5, 6], "روز هفته نامعتبر است"),
            startTime: Yup.string()
              .required("زمان شروع جلسه الزامی است")
              .matches(
                timeFormatRegex,
                "فرمت زمان شروع جلسه نامعتبر است (مثال: 10:30)"
              ),
            endTime: Yup.string()
              .required("زمان پایان جلسه الزامی است")
              .matches(
                timeFormatRegex,
                "فرمت زمان پایان جلسه نامعتبر است (مثال: 10:30)"
              ),
          })
          .test(
            "endTimeAfterStartTime",
            "ساعت پایان جلسه باید بعد از ساعت شروع باشد.",
            (schedule) => {
              const startMinutes = timeStringToMinutes(schedule.startTime);
              const endMinutes = timeStringToMinutes(schedule.endTime);

              return (!schedule || !schedule.startTime || !schedule.endTime) || 
                (!timeFormatRegex.test(schedule.startTime) ||
                !timeFormatRegex.test(schedule.endTime)) || 
                endMinutes > startMinutes;
            }
          )
      )
      .test(
        "noScheduleOverlap",
        "جلسات در یک روز هفته نباید همپوشانی داشته باشند.",
        (schedules) => {
          if (!schedules || schedules.length <= 1) return true;

          for (let i = 0; i < schedules.length; i++) {
            for (let j = i + 1; j < schedules.length; j++) {
              const schedule1 = schedules[i];
              const schedule2 = schedules[j];

              if (schedule1.dayOfWeek === schedule2.dayOfWeek) {
                const start1 = timeStringToMinutes(schedule1.startTime);
                const end1 = timeStringToMinutes(schedule1.endTime);
                const start2 = timeStringToMinutes(schedule2.startTime);
                const end2 = timeStringToMinutes(schedule2.endTime);
                if (start1 < end2 && start2 < end1) {
                  return false;
                }
              }
            }
          }
          return true;
        }
      ),

    currentScheduleDayOfWeek: Yup.string().optional().oneOf(["0", "1", "2", "3", "4", "5", "6"], "روز هفته نامعتبر است"),
    currentScheduleStartTime: Yup.string()
      .matches(timeFormatRegex, "فرمت زمان شروع نامعتبر است (مثال: 10:30)")
      .optional(),
    currentScheduleEndTime: Yup.string()
      .matches(timeFormatRegex, "فرمت زمان پایان نامعتبر است (مثال: 10:30)")
      .optional(),
  });
