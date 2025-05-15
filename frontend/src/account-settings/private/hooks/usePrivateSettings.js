import { useState } from "react";
import { useFormik } from "formik";
import { privateSettingsValidationSchema } from "../validation/privateSettingsValidationSchema";
import { updatePrivateSettings } from "../utils/updatePrivateSettingsApi";

const usePrivateSettings = ({ initialUserData, onSaveSuccess }) => {
  const [apiError, setApiError] = useState(null);

  const initialValues =
    initialUserData?.role?.id === 2
      ? {
          studentNumber: initialUserData?.studentNumber || "",
          major: initialUserData?.major || "",
          enrollmentYear: initialUserData?.enrollmentYear || 0,
          university: initialUserData?.university || 0,
          educationLevel: initialUserData?.educationLevel || 0,
        }
      : {
          employeeCode: initialUserData?.employeeCode || "",
          department: initialUserData?.department || "",
          university: initialUserData?.university || 0,
          rank: initialUserData?.rank || 0,
        };

  const formik = useFormik({
    initialValues,
    validationSchema: privateSettingsValidationSchema(
      initialUserData?.role?.id
    ),
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting }) => {
      setApiError(null);
      setSubmitting(true);
      try {
        const response = await updatePrivateSettings(
          initialUserData?.role?.id,
          values
        );

        if (response.ok) {
          if (onSaveSuccess) {
            const updatedUserData =
              initialUserData?.role?.id === 2
                ? {
                    studentId: values.studentNumber,
                    major: values.major,
                    entryYear: values.enrollmentYear,
                    university: Number(values.university),
                    degree: Number(values.educationLevel),
                  }
                : {
                    personnelCode: values.employeeCode,
                    faculty: values.department,
                    university: Number(values.university),
                    rank: Number(values.rank),
                  };
            onSaveSuccess(updatedUserData);
          }
        } else {
          const errorData = await response.json();
          throw new Error(
            errorData.message || "!خطایی در ذخیره اطلاعات خصوصی رخ داد"
          );
        }
      } catch (err) {
        setApiError(err.message || "!خطایی رخ داد");
      } finally {
        setSubmitting(false);
      }
    },
  });

  return { formik, apiError };
};

export default usePrivateSettings;
