import { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useFormik } from "formik";
import { groupFormValidationSchema } from "../validation/groupFormValidationSchema";
import {
  fetchGroupById,
  createGroupBulk,
  createGroupIndividual,
  updateGroup,
} from "../utils/groupFormApi";

const defaultInitialValues = {
  mode: "individual",
  file: null,
  name: "",
  leaderStudentNumber: "",
  studentTeams: [],
  currentMemberStudentNumber: "",
  initialStudentTeams: [],
};

const useGroupForm = ({ formType = "create", onSuccess = () => {} }) => {
  const { groupId, projectId } = useParams();

  const [apiError, setApiError] = useState(null);
  const [isLoading, setIsLoading] = useState(
    formType === "edit" && groupId !== null
  );
  const [initialValues, setInitialValues] = useState(defaultInitialValues);
  const [mode, setMode] = useState(defaultInitialValues.mode);

  useEffect(() => {
    if (formType === "edit" && groupId) {
      setIsLoading(true);
      setApiError(null);
      const loadGroupData = async () => {
        try {
          const data = await fetchGroupById(groupId);

          const studentTeamsData = (data.studentTeams || []).map((member) => ({
            studentNumber: member.studentNumber,
          }));

          const leaderStudent = (data.studentTeams || []).find(
            (member) => member.role === 1
          );
          const leaderStudentNumber = leaderStudent?.studentNumber || "";

          setInitialValues({
            ...defaultInitialValues,
            mode: "individual",
            name: data.name || "",
            leaderStudentNumber: leaderStudentNumber,
            studentTeams: studentTeamsData,
            initialStudentTeams: studentTeamsData,
          });

          setMode("individual");
        } catch (err) {
          setApiError(err.message || "!خطا در بارگیری اطلاعات گروه");
          setInitialValues(defaultInitialValues);
        } finally {
          setIsLoading(false);
        }
      };
      loadGroupData();
    } else {
      setInitialValues(defaultInitialValues);
      setMode(defaultInitialValues.mode);
      setIsLoading(false);
    }
  }, [groupId, formType]);

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: groupFormValidationSchema(mode, formType),
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      setApiError(null);
      setSubmitting(true);
      try {
        const formData = new FormData();

        if (formType === "create") {
          if (mode === "bulk") {
            if (values.file instanceof File) {
              formData.append("file", values.file);
            }
            await createGroupBulk(formData, projectId);
            resetForm({ values: defaultInitialValues, mode: 'bulk' });
          } else {
            const studentNumbers = (values.studentTeams || []).map(
              (member) => member.studentNumber
            );

            if (
              values.leaderStudentNumber &&
              !studentNumbers.includes(values.leaderStudentNumber)
            ) {
              studentNumbers.push(values.leaderStudentNumber);
            }

            formData.append("Name", values.name);
            formData.append("LeaderStudentNumber", values.leaderStudentNumber);

            studentNumbers.forEach((studentNumber, index) => {
              formData.append(`StudentNumbers[${index}]`, studentNumber);
            });
            await createGroupIndividual(formData, projectId);
            resetForm({ values: defaultInitialValues });
          }
          onSuccess("create");
        } else if (formType === "edit" && groupId) {
          const currentStudentNumbers = (values.studentTeams || []).map(
            (member) => member.studentNumber
          );
          const initialStudentNumbers = (
            initialValues.initialStudentTeams || []
          ).map((member) => member.studentNumber);

          const studentNumbersForComparison = [...currentStudentNumbers];
          if (
            values.leaderStudentNumber &&
            !studentNumbersForComparison.includes(values.leaderStudentNumber)
          ) {
            studentNumbersForComparison.push(values.leaderStudentNumber);
          }

          const initialStudentNumbersForComparison = [...initialStudentNumbers];
          const initialLeader = (initialValues.initialStudentTeams || []).find(
            (member) => member.role === 1
          );
          if (
            initialLeader &&
            initialLeader.studentNumber &&
            !initialStudentNumbersForComparison.includes(
              initialLeader.studentNumber
            )
          ) {
            initialStudentNumbersForComparison.push(
              initialLeader.studentNumber
            );
          }

          const addedStudentNumbers = studentNumbersForComparison.filter(
            (num) => !initialStudentNumbersForComparison.includes(num)
          );

          const deletedStudentNumbers =
            initialStudentNumbersForComparison.filter(
              (num) => !studentNumbersForComparison.includes(num)
            );

          formData.append("Name", values.name);
          formData.append("LeaderStudentNumber", values.leaderStudentNumber);

          addedStudentNumbers.forEach((studentNumber, index) => {
            formData.append(`AddedStudentNumbers[${index}]`, studentNumber);
          });

          deletedStudentNumbers.forEach((studentNumber, index) => {
            formData.append(`DeletedStudentNumbers[${index}]`, studentNumber);
          });

          await updateGroup(formData, groupId);
          setInitialValues((prev) => ({
            ...prev,
            name: values.name,
            leaderStudentNumber: values.leaderStudentNumber,
            studentTeams: values.studentTeams,
            initialStudentTeams: values.studentTeams,
          }));
          onSuccess("edit");
        }
      } catch (err) {
        setApiError(err.message || "!خطا در ثبت اطلاعات گروه");
      } finally {
        setSubmitting(false);
      }
    },
  });

  useEffect(() => {
    if (formik.values.mode !== mode) {
      formik.setFieldValue("mode", mode);
      if (mode === "bulk") {
        formik.setFieldValue("name", "");
        formik.setFieldValue("leaderStudentNumber", "");
        formik.setFieldValue("studentTeams", []);
        formik.setFieldValue("currentMemberStudentNumber", "");
      } else {
        formik.setFieldValue("file", null);
        if (formType === "create") {
          formik.setFieldValue("name", "");
          formik.setFieldValue("leaderStudentNumber", "");
          formik.setFieldValue("studentTeams", []);
          formik.setFieldValue("currentMemberStudentNumber", "");
        }
      }
      formik.setErrors({});
      formik.setTouched({});
    }
  }, [mode]);

  const handleAddMember = () => {
    const { currentMemberStudentNumber, studentTeams } = formik.values;

    if (!currentMemberStudentNumber) {
      setApiError("لطفا شماره دانشجویی دانشجو را وارد کنید.");
      formik.setFieldTouched("currentMemberStudentNumber", true);
      return;
    }

    if (
      (studentTeams || []).some(
        (member) => member.studentNumber === currentMemberStudentNumber
      )
    ) {
      setApiError(
        `دانشجویی با شماره دانشجویی ${currentMemberStudentNumber} قبلا اضافه شده است.`
      );
      formik.setFieldError(
        "currentMemberStudentNumber",
        "شماره دانشجویی تکراری است."
      );
      formik.setFieldTouched("currentMemberStudentNumber", true);
      return;
    }

    const newMember = {
      studentNumber: currentMemberStudentNumber,
    };

    formik.setFieldValue("studentTeams", [...(studentTeams || []), newMember]);

    formik.setFieldValue("currentMemberStudentNumber", "");

    setApiError(null);
    formik.setFieldError("currentMemberStudentNumber", null);
    formik.setFieldTouched("currentMemberStudentNumber", false);
    formik.setFieldError("studentTeams", null);
    formik.setFieldTouched("studentTeams", false);
  };

  const handleRemoveMember = (indexToRemove) => {
    formik.setFieldValue(
      "studentTeams",
      formik.values.studentTeams.filter((_, index) => index !== indexToRemove)
    );
    if (
      formik.values.leaderStudentNumber ===
      formik.values.studentTeams[indexToRemove]?.studentNumber
    ) {
      formik.setFieldValue("leaderStudentNumber", "");
    }
    setApiError(null);
    formik.setFieldError("studentTeams", null);
  };


  return {
    formik,
    apiError,
    isLoading,
    mode,
    setMode,
    handleAddMember,
    handleRemoveMember,
  };
};

export default useGroupForm;
