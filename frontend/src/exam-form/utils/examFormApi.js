import { handleApiResponse } from "../../utils/handleApiResponse";
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

export const fetchExamById = async (examId) => {
  const response = await fetch(`${apiBaseUrl}/api/Exam/Instructor/${examId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    }
  );
  return await handleApiResponse(response, "!خطا در دریافت اطلاعات امتحان");
};

export const createExam = async (formData, classId) => {
  const response = await fetch(`${apiBaseUrl}/api/Exam?classId=${classId}`, {
      method: "POST",
      credentials: "include",
      body: formData,
    }
  );

  return handleApiResponse(response, "!خطا در ایجاد امتحان");
};

export const updateExam = async (formData, examId) => {
  const response = await fetch(`${apiBaseUrl}/api/Exam/${examId}`, {
      method: "PATCH",
      credentials: "include",
      body: formData,
    }
  );

  return handleApiResponse(response, "!خطا در ویرایش امتحان");
};
