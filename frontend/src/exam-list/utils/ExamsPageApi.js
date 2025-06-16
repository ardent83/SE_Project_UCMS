
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

export const deleteExamById = async (examId) => {
    try {
        const response = await fetch(`${apiBaseUrl}/api/Exam/${examId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error("Failed to delete exam");
        }

        return true;
    } catch (error) {
        console.error("Error deleting exam:", error);
        return false;
    }
};