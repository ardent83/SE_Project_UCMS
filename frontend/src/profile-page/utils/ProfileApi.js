const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

export const handleViewProfile = async () => {
    try {
        const res = await fetch(`${apiBaseUrl}/api/students/profile`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
            },
        });

        if (!res.ok) throw new Error('Error in catching profile info');

        return await res.json();
    } catch (error) {
        console.error('Error:', error.message);
        throw error;
    }
};
