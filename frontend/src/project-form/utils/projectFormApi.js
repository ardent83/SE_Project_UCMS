import { handleApiResponse } from "../../utils/handleApiResponse";
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

export const fetchProjectById = async (projectId) => {
  const response = await fetch(`${apiBaseUrl}/api/Project/Instructor/${projectId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  return await handleApiResponse(response, "!خطا در دریافت اطلاعات پروژه");
};

export const createProject = async (formData, classId) => {
  const response = await fetch(`${apiBaseUrl}/api/project?classId=${classId}`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  return handleApiResponse(response, "!خطا در ایجاد پروژه");
};

export const updateProject = async (formData, classId, projectId) => {
  const response = await fetch(`${apiBaseUrl}/api/Project/${projectId}?classId=${classId}`, {
    method: "PATCH",
    credentials: "include",
    body: formData,
  });

  return handleApiResponse(response, "!خطا در ویرایش پروژه");
};
