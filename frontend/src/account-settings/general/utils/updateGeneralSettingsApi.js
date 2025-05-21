const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

export const updateGeneralSettings = async (generalData) => {
    const response = await fetch(`${apiBaseUrl}/api/users/profile/edit`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(generalData),
    });
    return response;
};
