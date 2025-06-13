import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useFormik } from "formik";
import { exerciseFormValidationSchema } from "../validation/exerciseFormValidationSchema";
import {
  fetchExerciseById,
  createExercise,
  updateExercise,
} from "../utils/exerciseFormApi";

const defaultInitialValues = {
  title: "",
  exerciseScore: 0,
  startDate: null,
  endDate: null,
  description: "",
  fileFormats: [],
  exerciseFile: null,
};

const useExerciseForm = ({ formType = "create", onSuccess = () => {} }) => {
  const { exerciseId, classId } = useParams();

  const [apiError, setApiError] = useState(null);
  const [isLoading, setIsLoading] = useState(
    formType === "edit" && exerciseId !== undefined
  );
  const [initialValues, setInitialValues] = useState(defaultInitialValues);

  useEffect(() => {
    if (formType === "edit" && exerciseId !== undefined) {
      setIsLoading(true);
      setApiError(null);
      const loadExerciseData = async () => {
        try {
          const data = await fetchExerciseById(exerciseId);
          const fileFormatsArray = data.fileFormats.split(/\s*,\s*/);
          setInitialValues({
            ...defaultInitialValues,
            ...data,
            fileFormats: fileFormatsArray,
            exerciseFile: null,
          });
        } catch (err) {
          setApiError(err.message || "!خطا در بارگیری اطلاعات تکلیف");
          setInitialValues(defaultInitialValues);
        } finally {
          setIsLoading(false);
        }
      };
      loadExerciseData();
    } else {
      setIsLoading(false);
    }
  }, [exerciseId, formType]);

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: exerciseFormValidationSchema(formType),
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
        formData.append("ExerciseScore", values.exerciseScore);
        formData.append("FileFormats", values.fileFormats.join(","));

        if (values.exerciseFile instanceof File) {
          formData.append("ExerciseFile", values.exerciseFile);
        }

        if (formType === "create") {
          const response = await createExercise(formData, classId);
          resetForm({ values: defaultInitialValues });
          onSuccess("create", response.data.exerciseId);
        } else if (formType === "edit") {
          await updateExercise(formData, exerciseId);
          onSuccess("edit", exerciseId);
        }
      } catch (err) {
        setApiError(err.message || "!خطا در ثبت اطلاعات تکلیف");
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

export default useExerciseForm;
