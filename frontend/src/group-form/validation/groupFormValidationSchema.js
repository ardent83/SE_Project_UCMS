import * as Yup from "yup";

export const groupFormValidationSchema = (mode, formType) => {
  const baseSchema = Yup.object().shape({});

  const bulkSchema = Yup.object().shape({
    file: Yup.mixed()
      .required("فایل گروه الزامی است")
      .test("fileSize", "حجم فایل بیشتر از حد مجاز است", (value) => {
        if (!value) return true;
        return value.size <= 5 * 1024 * 1024;
      })
      .test(
        "fileType",
        `.فرمت فایل نامعتبر است. فقط فایل‌های ${".xlsx, .xls, .csv"} مجاز هستند`,
        (value) => {
          if (!value) return true;
          return [
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
            "application/vnd.ms-excel", // .xls
            "text/csv", // .csv
          ].includes(value.type);
        }
      ),
  });

  const individualSchema = Yup.object().shape({
    name: Yup.string()
      .required("نام گروه الزامی است")
      .min(1, "نام گروه حداقل باید ۱ کاراکتر باشد")
      .max(100, "نام گروه حداکثر می‌تواند ۱۰۰ کاراکتر باشد"),
    leaderStudentNumber: Yup.string()
      .required("شماره دانشجویی مدیر گروه الزامی است")
      .matches(/^\d+$/, "شماره دانشجویی باید فقط شامل اعداد باشد")
      .min(9, "شماره دانشجویی حداقل باید ۹ رقم باشد")
      .max(10, "شماره دانشجویی حداکثر می‌تواند ۱۰ رقم باشد"),
    studentTeams: Yup.array()
      .min(1, "حداقل یک دانشجو باید به گروه اضافه شود")
      .of(
        Yup.object().shape({
          studentNumber: Yup.string()
            .required("شماره دانشجویی دانشجو الزامی است")
            .matches(/^\d+$/, "شماره دانشجویی باید فقط شامل اعداد باشد")
            .min(9, "شماره دانشجویی حداقل باید ۹ رقم باشد")
            .max(10, "شماره دانشجویی حداکثر می‌تواند ۱۰ رقم باشد"),
        })
      )
      .test(
        "uniqueStudentIds",
        "شماره دانشجویی اعضای گروه باید یکتا باشند",
        (members) => {
          if (!members || members.length === 0) {
            return true;
          }
          const studentNumbers = members.map((member) => member.studentNumber);
          const uniqueStudentNumbers = new Set(studentNumbers);
          return studentNumbers.length === uniqueStudentNumbers.size;
        }
      ),

    currentMemberStudentNumber: Yup.string().optional(),
  });

  if (mode === "bulk") {
    return baseSchema.concat(bulkSchema);
  } else {
    return baseSchema.concat(individualSchema);
  }
};
