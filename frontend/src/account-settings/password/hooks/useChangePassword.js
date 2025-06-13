import { useState } from "react";
import { useFormik } from "formik";
import { passwordValidationSchema } from "../validation/passwordValidationSchema";
import { changePassword } from "../utils/changePasswordApi";
import { handleApiResponse } from "../../../utils/handleApiResponse";

const useChangePassword = ({ onSave }) => {
  const [apiError, setApiError] = useState(null);

  const initialValues = {
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  };
  
  const formik = useFormik({
    initialValues,
    validationSchema: passwordValidationSchema(),
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      setApiError(null);
      setSubmitting(true);
      try {
        const response = await changePassword(
          values.oldPassword,
          values.newPassword,
          values.confirmNewPassword
        );

        if (response.ok) {
          if (onSave) {
            onSave(true);
          }
          resetForm();
        } else {
          const errorData = handleApiResponse(response);
          throw new Error(
            errorData.message || "!خطایی در تغییر رمز عبور رخ داد"
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

export default useChangePassword;
