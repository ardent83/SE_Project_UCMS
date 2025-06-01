import * as Yup from "yup";


export const privateSettingsValidationSchema = (userRole) => {
  const baseSchema = Yup.object({});

  if (userRole === 2) {
    return baseSchema.shape({
      studentNumber: Yup.string().required("شماره دانشجویی الزامی است"),
      major: Yup.string().required("رشته تحصیلی الزامی است"),
      enrollmentYear: Yup.number()
        .typeError("سال ورود باید عدد باشد")
        .required("سال ورود الزامی است")
        .positive("سال ورود باید مثبت باشد")
        .integer("سال ورود باید عدد صحیح باشد"),
      university: Yup.number(),
      educationLevel: Yup.number(),
    });
  } else if (userRole === 1) {
    return baseSchema.shape({
      employeeCode: Yup.string().required("کد پرسنلی الزامی است"),
      department: Yup.string().required("دانشکده الزامی است"),
      university: Yup.number(),
      rank: Yup.number(),
    });
  }

  return baseSchema;
};
