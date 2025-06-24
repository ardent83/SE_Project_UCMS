import { handleApiResponse } from "../../utils/handleApiResponse";
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;


export const fetchClassById = async (classId) => {
  const response = await fetch(`${apiBaseUrl}/api/classes/instructor/${classId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  return await handleApiResponse(response, "!خطا در دریافت اطلاعات کلاس");
};

export const createClass = async (formData) => {
  const response = await fetch(`${apiBaseUrl}/api/classes`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  return handleApiResponse(response, "!خطا در ایجاد کلاس");
};

export const updateClass = async (formData, classId) => {
  const response = await fetch(`${apiBaseUrl}/api/classes/${classId}`, {
    method: "PATCH",
    credentials: "include",
    body: formData,
  });

  return handleApiResponse(response, "!خطا در ویرایش کلاس");
};
