import { handleApiResponse } from "../../utils/handleApiResponse";
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

export const fetchPhaseById = async (phaseId) => {
  const response = await fetch(`${apiBaseUrl}/api/Phase/Instructor/${phaseId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    }
  );
  return await handleApiResponse(response, "!خطا در دریافت اطلاعات فاز");
};

export const createPhase = async (formData, projectId) => {
  const response = await fetch(`${apiBaseUrl}/api/Phase?projectId=${projectId}`, {
      method: "POST",
      credentials: "include",
      body: formData,
    }
  );

  return handleApiResponse(response, "!خطا در ایجاد فاز");
};

export const updatePhase = async (formData, projectId, phaseId) => {
  const response = await fetch(`${apiBaseUrl}/api/Phase/${phaseId}?projectId=${projectId}`, {
      method: "PATCH",
      credentials: "include",
      body: formData,
    }
  );

  return handleApiResponse(response, "!خطا در ویرایش فاز");
};
