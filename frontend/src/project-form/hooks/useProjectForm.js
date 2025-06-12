import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useFormik } from "formik";
import { projectFormValidationSchema } from "../validation/projectFormValidationSchema";
import {
  fetchProjectById,
  createProject,
  updateProject,
} from "../utils/projectFormApi";

const defaultInitialValues = {
  title: "",
  totalScore: 1,
  projectType: 1,
  groupSize: 1,
  startDate: null,
  endDate: null,
  description: "",
  projectFile: null,
};

const useProjectForm = ({ formType = "create", onSuccess = () => {} }) => {
  const { projectId, classId } = useParams();

  const [apiError, setApiError] = useState(null);
  const [isLoading, setIsLoading] = useState(
    formType === "edit" && projectId !== undefined
  );
  const [initialValues, setInitialValues] = useState(defaultInitialValues);

  useEffect(() => {
    if (formType === "edit" && projectId !== undefined) {
      setIsLoading(true);
      setApiError(null);
      const loadProjectData = async () => {
        try {
          const data = await fetchProjectById(projectId);
          setInitialValues({
            ...defaultInitialValues,
            ...data,
            projectFile: null,
          });
        } catch (err) {
          setApiError(err.message || "!خطا در بارگیری اطلاعات پروژه");
          setInitialValues(defaultInitialValues);
        } finally {
          setIsLoading(false);
        }
      };
      loadProjectData();
    } else {
      setIsLoading(false);
    }
  }, [projectId, formType]);

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: projectFormValidationSchema(formType),
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      setApiError(null);
      setSubmitting(true);
      try {
        const formData = new FormData();

        formData.append("Title", values.title);
        formData.append("TotalScore", values.totalScore);
        if (formType === "create") {
          formData.append("ProjectType", values.projectType);
          formData.append("GroupSize", values.groupSize);
        }
        formData.append("StartDate", values.startDate);
        formData.append("EndDate", values.endDate);
        formData.append("Description", values.description || "");

        if (values.projectFile instanceof File) {
          formData.append("ProjectFile", values.projectFile);
        }

        if (formType === "create") {
          await createProject(formData, classId);
          resetForm({ values: defaultInitialValues });
          onSuccess("create");
        } else if (formType === "edit" && projectId !== undefined) {
          await updateProject(formData, projectId);
          onSuccess("edit");
        }
      } catch (err) {
        setApiError(err.message || "!خطا در ثبت اطلاعات پروژه");
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

export default useProjectForm;
