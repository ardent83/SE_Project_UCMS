const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

export const changePassword = async (oldPassword, newPassword, confirmNewPassword) => {
    const confirmNewPasswrod = confirmNewPassword;
    const response = await fetch(`${apiBaseUrl}/api/users/profile/change-password`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ oldPassword, newPassword, confirmNewPasswrod }),
    });
    return response;
};
