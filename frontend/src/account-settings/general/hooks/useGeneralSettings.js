import { useState } from "react";
import { useFormik } from "formik";
import { generalSettingsValidationSchema } from "../validation/generalSettingsValidationSchema";
import { updateGeneralSettings } from "../utils/updateGeneralSettingsApi";

const useGeneralSettings = ({ initialUserData, onSaveSuccess }) => {
  const [apiError, setApiError] = useState(null);

  const initialValues = {
    firstName: initialUserData?.firstName || "",
    lastName: initialUserData?.lastName || "",
    gender: initialUserData?.gender,
    address: initialUserData?.address || "",
    bio: initialUserData?.bio || "",
    dateOfBirth: initialUserData?.dateOfBirth || "",
  };

  const formik = useFormik({
    initialValues,
    validationSchema: generalSettingsValidationSchema(),
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting }) => {
      setApiError(null);
      setSubmitting(true);
      try {
        const apiPayload = {
            firstName: values.firstName,
            lastName: values.lastName,
            gender: values.gender,
            address: values.address,
            bio: values.bio,
            dateOfBirth: values.dateOfBirth,
        };

        const response = await updateGeneralSettings(apiPayload);

        if (response.ok) {
          if (onSaveSuccess) {
             onSaveSuccess(values);
          }
        } else {
          const errorData = await response.json();
          throw new Error(errorData.message || "!خطایی در ذخیره اطلاعات عمومی رخ داد");
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

export default useGeneralSettings;
