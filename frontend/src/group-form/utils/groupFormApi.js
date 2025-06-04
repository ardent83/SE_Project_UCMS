import { handleApiResponse } from "../../utils/handleApiResponse";
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

export const fetchGroupById = async (groupId) => {
  const response = await fetch(`${apiBaseUrl}/api/Teams/instructor/${groupId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  return handleApiResponse(response);
};

export const createGroupBulk = async (formData, projectId) => {
  const response = await fetch(`${apiBaseUrl}/api/Teams/${projectId}`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  return handleApiResponse(response);
};

export const createGroupIndividual = async (formData, projectId) => {
  const response = await fetch(
    `${apiBaseUrl}/api/Teams?projectId=${projectId}`,
    {
      method: "POST",
      credentials: "include",
      body: formData,
    }
  );

  return handleApiResponse(response);
};

export const updateGroup = async (formData, groupId) => {
  const response = await fetch(`${apiBaseUrl}/api/Teams/${groupId}`, {
    method: "PATCH",
    credentials: "include",
    body: formData,
  });

  return handleApiResponse(response);
};
