const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

export const submitClassForm = async (prop) => {
    const response = await fetch(`${apiBaseUrl}/api/class/...`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(prop),
    });
    return response;
};