import { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import { useFormik } from "formik";
import { classFormValidationSchema } from "../validation/classFormValidationSchema";
import {
  fetchClassById,
  createClass,
  updateClass,
} from "../utils/classFormApi";

const defaultInitialValues = {
  title: "",
  description: "",
  password: "",
  confirmPassword: "",
  startDate: null,
  endDate: null,
  profileImage: null,
  schedules: [],
  currentScheduleDayOfWeek: "",
  currentScheduleStartTime: "",
  currentScheduleEndTime: "",
};

const useClassForm = ({
  formType = "create",
  onSuccess = () => {},
}) => {
  const { classId } = useParams();

  const [apiError, setApiError] = useState(null);
  const [isLoading, setIsLoading] = useState(
    formType === "edit" && classId !== null
  );
  const [initialValues, setInitialValues] = useState(defaultInitialValues);

  useEffect(() => {
    if (formType === "edit" && classId) {
      setIsLoading(true);
      setApiError(null);
      const loadClassData = async () => {
        try {
          const data = await fetchClassById(classId);
          setInitialValues({
            ...defaultInitialValues,
            title: data.title || "",
            description: data.description || "",
            startDate: data.startDate,
            endDate: data.endDate,
            schedules: (data.schedules || []).map((schedule) => ({
              dayOfWeek: schedule.dayOfWeek,
              startTime: schedule.startTime.substring(0, 5),
              endTime: schedule.endTime.substring(0, 5),
            })),
          });
        } catch (err) {
          setApiError(err.message || "Error loading class data!");
          setInitialValues(defaultInitialValues);
        } finally {
          setIsLoading(false);
        }
      };
      loadClassData();
    } else {
      setIsLoading(false);
    }
  }, [classId, formType]);

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: classFormValidationSchema(formType),
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      setApiError(null);
      setSubmitting(true);
      try {
        const formData = new FormData();

        formData.append("Title", values.title);
        formData.append("Description", values.description);

        if (formType === "create") {
          formData.append("Password", values.password);
          formData.append("ConfirmPassword", values.confirmPassword);
        }

        if (values.profileImage instanceof File) {
          formData.append("ProfileImage", values.profileImage);
        }

        formData.append("StartDate", values.startDate);
        formData.append("EndDate", values.endDate);

        (values.schedules || []).forEach((schedule, index) => {
          formData.append(`Schedules[${index}].DayOfWeek`, schedule.dayOfWeek);
          formData.append(
            `Schedules[${index}].StartTime`,
            `${schedule.startTime}:00`
          );
          formData.append(
            `Schedules[${index}].EndTime`,
            `${schedule.endTime}:00`
          );
        });

        if (formType === "create") {
          const response = await createClass(formData);
          resetForm({ values: defaultInitialValues });
          onSuccess("create", response.data.id);
        } else if (formType === "edit" && classId) {
          await updateClass(formData, classId);
          onSuccess("edit", classId);
        }
      } catch (err) {
        setApiError(err.message || "!خطا در ثبت اطلاعات کلاس");
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleAddSchedule = () => {
    const {
      currentScheduleDayOfWeek,
      currentScheduleStartTime,
      currentScheduleEndTime,
    } = formik.values;

    if (
      currentScheduleDayOfWeek === "" ||
      !currentScheduleStartTime ||
      !currentScheduleEndTime
    ) {
      setApiError("لطفا روز، ساعت شروع و پایان جلسه را انتخاب کنید.");
      return;
    }

    const timeToMinutes = (timeString) => {
      if (!timeString) return 0;
      const [hours, minutes] = timeString.split(":").map(Number);
      return hours * 60 + minutes;
    };

    const startTimeMinutes = timeToMinutes(currentScheduleStartTime);
    const endTimeMinutes = timeToMinutes(currentScheduleEndTime);

    if (startTimeMinutes >= endTimeMinutes) {
      setApiError("ساعت پایان جلسه باید بعد از ساعت شروع باشد.");
      return;
    }

    const newSchedule = {
      dayOfWeek: parseInt(currentScheduleDayOfWeek, 10),
      startTime: currentScheduleStartTime,
      endTime: currentScheduleEndTime,
    };

    formik.setFieldValue("schedules", [
      ...(formik.values.schedules || []),
      newSchedule,
    ]);

    formik.setFieldValue("currentScheduleDayOfWeek", "");
    formik.setFieldValue("currentScheduleStartTime", "");
    formik.setFieldValue("currentScheduleEndTime", "");

    setApiError(null);
  };

  const handleRemoveSchedule = (indexToRemove) => {
    formik.setFieldValue(
      "schedules",
      formik.values.schedules.filter((_, index) => index !== indexToRemove)
    );
    setApiError(null);
  };

  return {
    formik,
    apiError,
    isLoading,
    handleAddSchedule,
    handleRemoveSchedule,
  };
};

export default useClassForm;
