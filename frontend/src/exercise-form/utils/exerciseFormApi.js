import { handleApiResponse } from "../../utils/handleApiResponse";
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

export const fetchExerciseById = async (exerciseId) => {
  const response = await fetch(`${apiBaseUrl}/api/Exercise/Instructor/${exerciseId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    }
  );
  return await handleApiResponse(response, "!خطا در دریافت اطلاعات تکلیف");
};

export const createExercise = async (formData, classId) => {
  const response = await fetch(`${apiBaseUrl}/api/Exercise?classId=${classId}`, {
      method: "POST",
      credentials: "include",
      body: formData,
    }
  );

  return handleApiResponse(response, "!خطا در ایجاد تکلیف");
};

export const updateExercise = async (formData, classId, exerciseId) => {
  const response = await fetch(`${apiBaseUrl}/api/Exercise/${exerciseId}?classId=${classId}`, {
      method: "PATCH",
      credentials: "include",
      body: formData,
    }
  );

  return handleApiResponse(response, "!خطا در ویرایش تکلیف");
};
