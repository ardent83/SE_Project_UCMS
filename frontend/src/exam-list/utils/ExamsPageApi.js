
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

export const getExamsForInstructor = async () => {
    const response = await fetch(`${apiBaseUrl}/api/Instructor/exams`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
    });

    if (!response.ok) {
        throw new Error('Failed to fetch exams');
    }
    return response.json();
};


export const getExamsForStudent = async () => {
    const response = await fetch(`${apiBaseUrl}/api/Student/exams`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
    });

    if (!response.ok) {
        throw new Error('Failed to fetch exams');
    }
    return response.json();
};