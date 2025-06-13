import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useFormik } from "formik";
import { examFormValidationSchema } from "../validation/examFormValidationSchema";
import {
  fetchExamById,
  createExam,
  updateExam,
} from "../utils/examFormApi";

const defaultInitialValues = {
  title: "",
  examLocation: "",
  date: null,
  examScore: 0,
};

const useExamForm = ({ formType = "create", onSuccess = () => {} }) => {
  const { examId, classId } = useParams();

  const [apiError, setApiError] = useState(null);
  const [isLoading, setIsLoading] = useState(
    formType === "edit" && examId !== undefined
  );
  const [initialValues, setInitialValues] = useState(defaultInitialValues);

  useEffect(() => {
    if (formType === "edit" && examId !== undefined) {
      setIsLoading(true);
      setApiError(null);
      const loadExamData = async () => {
        try {
          const data = await fetchExamById(examId);
          setInitialValues({
            ...defaultInitialValues,
            ...data,
          });
        } catch (err) {
          setApiError(err.message || "!خطا در بارگیری اطلاعات امتحان");
          setInitialValues(defaultInitialValues);
        } finally {
          setIsLoading(false);
        }
      };
      loadExamData();
    } else {
      setIsLoading(false);
    }
  }, [examId, formType]);

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: examFormValidationSchema(formType),
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      setApiError(null);
      setSubmitting(true);
      try {
        const formData = new FormData();

        formData.append("Title", values.title);
        formData.append("ExamLocation", values.examLocation);
        formData.append("Date", values.date);
        formData.append("ExamScore", values.examScore);

        if (formType === "create") {
          await createExam(formData, classId);
          resetForm({ values: defaultInitialValues });
          onSuccess("create");
        } else if (formType === "edit") {
          await updateExam(formData, examId);
          onSuccess("edit");
        }
      } catch (err) {
        setApiError(err.message || "!خطا در ثبت اطلاعات امتحان");
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

export default useExamForm;
