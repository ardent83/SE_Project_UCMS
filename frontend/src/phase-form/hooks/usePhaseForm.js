import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useFormik } from "formik";
import { phaseFormValidationSchema } from "../validation/phaseFormValidationSchema";
import {
  fetchPhaseById,
  createPhase,
  updatePhase,
} from "../utils/phaseFormApi";

const defaultInitialValues = {
  title:"",
  phaseScore: 0,
  startDate: null,
  endDate: null,
  description: "",
  fileFormats: [],
  phaseFile: null,
};

const usePhaseForm = ({ formType = "create", onSuccess = () => {} }) => {
  const { phaseId, projectId } = useParams();

  const [apiError, setApiError] = useState(null);
  const [isLoading, setIsLoading] = useState(
    formType === "edit" && phaseId !== undefined
  );
  const [initialValues, setInitialValues] = useState(defaultInitialValues);

  useEffect(() => {
    if (formType === "edit" && phaseId !== undefined) {
      setIsLoading(true);
      setApiError(null);
      const loadPhaseData = async () => {
        try {
          const data = await fetchPhaseById(phaseId);
          const fileFormatsArray = data.fileFormats.split(/\s*,\s*/);
          setInitialValues({
            ...defaultInitialValues,
            ...data,
            fileFormats: fileFormatsArray,
            phaseFile: null,
          });
        } catch (err) {
          setApiError(err.message || "!خطا در بارگیری اطلاعات فاز");
          setInitialValues(defaultInitialValues);
        } finally {
          setIsLoading(false);
        }
      };
      loadPhaseData();
    } else {
      setIsLoading(false);
    }
  }, [phaseId, formType]);

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: phaseFormValidationSchema(formType),
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      setApiError(null);
      setSubmitting(true);
      try {
        const formData = new FormData();

        formData.append("Title", values.title);
        formData.append("StartDate", values.startDate);
        formData.append("EndDate", values.endDate);
        formData.append("Description", values.description || "");
        formData.append("PhaseScore", values.phaseScore);
        formData.append("FileFormats", values.fileFormats.join(","));

        if (values.phaseFile instanceof File) {
          formData.append("PhaseFile", values.phaseFile);
        }

        if (formType === "create") {
          await createPhase(formData, projectId);
          resetForm({ values: defaultInitialValues });
          onSuccess("create");
        } else if (formType === "edit") {
          await updatePhase(formData, projectId, phaseId);
          onSuccess("edit");
        }
      } catch (err) {
        setApiError(err.message || "!خطا در ثبت اطلاعات فاز");
      } finally {
        setSubmitting(false);
      }
    },
  });

  return {
    formik,
    apiError,
    isLoading,
  };
};

export default usePhaseForm;
