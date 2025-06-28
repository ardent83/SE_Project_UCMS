const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;


export const handleViewProfileForInstructor = async () => {
    try {
        const res = await fetch(`${apiBaseUrl}/api/instructors/profile`, {
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

export const handleViewProfileForStudent = async () => {
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


export const handleViewProfileForStudentClass = async (userId) => {
    try {
        const res = await fetch(`${apiBaseUrl}/api/students/${userId}/profile`, {
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
