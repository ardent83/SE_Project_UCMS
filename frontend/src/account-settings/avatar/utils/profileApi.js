const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;


export const uploadProfileImage = async (file) => {
  const formData = new FormData();
  formData.append('ProfileImage', file);

  const response = await fetch(`${apiBaseUrl}/api/users/profile/change-image`, {
    method: 'POST',
    credentials: 'include',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "!خطایی در آپلود تصویر رخ داد");
  }
};

export const deleteProfileImage = async () => {
  const response = await fetch(`${apiBaseUrl}/api/users/profile/remove-image`, {
    method: 'DELETE',
    credentials: 'include',
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "!خطایی در حذف تصویر رخ داد");
  }
};
