import { handleApiResponse } from "../../utils/handleApiResponse";
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

export const fetchUserProfile = async () => {
  const response = await fetch(`${apiBaseUrl}/api/users/profile`, {
    method: "GET",
    credentials: "include",
  });
  const result = await handleApiResponse(response, 'خطا در دریافت اطلاعات عمومی کاربر');
  if (!result.success) {
    throw new Error(result.message || 'دریافت اطلاعات عمومی کاربر موفقیت‌آمیز نبود');
  }
  return result.data;
};

export const fetchInstructorSpecializedInfo = async () => {
  const response = await fetch(`${apiBaseUrl}/api/instructors/profile/Specialized-info`, {
    method: "GET",
    credentials: "include",
  });
  const result = await handleApiResponse(response, 'خطا در دریافت اطلاعات تخصصی استاد');
  if (!result.success) {
    throw new Error(result.message || 'دریافت اطلاعات تخصصی استاد موفقیت‌آمیز نبود');
  }
  return result.data;
};

export const fetchStudentSpecializedInfo = async () => {
  const response = await fetch(`${apiBaseUrl}/api/students/profile/specialized-info`, {
    method: "GET",
    credentials: "include",
  });
  const result = await handleApiResponse(response, 'خطا در دریافت اطلاعات تخصصی دانشجو');
  if (!result.success) {
    throw new Error(result.message || 'دریافت اطلاعات تخصصی دانشجو موفقیت‌آمیز نبود');
  }
  return result.data;
};
