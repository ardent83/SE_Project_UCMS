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
