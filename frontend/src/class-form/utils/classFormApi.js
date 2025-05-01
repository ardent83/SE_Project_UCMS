import { data } from "react-router-dom";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const handleApiResponse = async (response, defaultErrorMessage = '!خطایی در ارتباط با سرور رخ داد') => {
  if (!response.ok) {
    let errorData = {};
    try {
      errorData = await response.json();
    } catch (e) {
      throw new Error(`${defaultErrorMessage}. وضعیت: ${response.status}`);
    }

    if (errorData.errors && typeof errorData.errors === 'object') {
      const validationErrors = Object.keys(errorData.errors)
        .map(key => {
          const messages = errorData.errors[key].join(', ');
          return `${key}: ${messages}`;
        })
        .join('\n');
      throw new Error(validationErrors);
    }

    if (errorData.message) {
        throw new Error(errorData.message);
    }

    throw new Error(defaultErrorMessage);
  }

  let data = {};
  try {
    data = await response.json();
  } catch (e) {
    data = " !پاسخ سرور json نیست ولی خب اوکیه"
  }
  return data;
};

export const fetchClassById = async (classId) => {
  const response = await fetch(`${apiBaseUrl}/api/classes/instructor/${classId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  const classData = await handleApiResponse(response);
  return {
    id: classData.id,
    title: classData.title || "",
    description: classData.description || "",
    startDate: classData.startDate ? classData.startDate : null,
    endDate: classData.endDate ? classData.endDate : null,
    schedules: (classData.schedules || []).map((schedule) => ({
      dayOfWeek: schedule.dayOfWeek,
      startTime: schedule.startTime,
      endTime: schedule.endTime,
    })),
  };
};

export const createClass = async (formData) => {
  const response = await fetch(`${apiBaseUrl}/api/classes`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  return handleApiResponse(response);
};

export const updateClass = async (formData, classId) => {
  const response = await fetch(`${apiBaseUrl}/api/classes/${classId}`, {
    method: "PATCH",
    credentials: "include",
    body: formData,
  });

  return handleApiResponse(response);
};
