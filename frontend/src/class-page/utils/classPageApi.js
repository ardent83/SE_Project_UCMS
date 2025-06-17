import {useAuth} from "../../auth/context/AuthContext.jsx";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

export const getClassInfoForInstructor = async (classId) => {
    const response = await fetch(`${apiBaseUrl}/api/classes/instructor/${classId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
    });

    if (!response.ok) {
        throw new Error('Failed to fetch class info');
    }
    return response.json();
};


export const getClassInfoForStudent = async (classId) => {
    const response = await fetch(`${apiBaseUrl}/api/StudentClass/student/${classId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
    });

    if (!response.ok) {
        throw new Error('Failed to fetch class info');
    }
    return response.json();
};


export const getStudentOfClassForInstructor = async (classId) => {
    const response = await fetch(`${apiBaseUrl}/api/StudentClass/Instructor/${classId}/Students`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
    });

    if (!response.ok) {
        throw new Error('Failed to fetch class students');
    }

    return response.json();
};


export const getStudentOfClassForStudent = async (classId) => {
    const response = await fetch(`${apiBaseUrl}/api/StudentClass/Student/${classId}/Students`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
    });

    if (!response.ok) {
        throw new Error('Failed to fetch class students');
    }

    return response.json();
};

export const getAssignmentsForInstructor = async (classId) => {
    const response = await fetch(`${apiBaseUrl}/api/Exercise/Instructor/class/${classId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
    });

    if (!response.ok) {
        throw new Error('Failed to fetch class assignments');
    }

    return response.json();
};

export const getAssignmentsForStudent = async (classId) => {
    const response = await fetch(`${apiBaseUrl}/api/Exercise/Student/class/${classId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
    });

    if (!response.ok) {
        throw new Error('Failed to fetch class assignments');
    }

    return response.json();
};

export const getProjectsForInstructor = async (classId) => {
    const response = await fetch(`${apiBaseUrl}/api/Project/${classId}/projectsOfClass/Instructor`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
    });

    if (!response.ok) {
        throw new Error('Failed to fetch class projects');
    }

    return response.json();
};

export const getProjectsForStudent = async (classId) => {
    const response = await fetch(`${apiBaseUrl}/api/Project/${classId}/projectsOfClass/Student`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
    });

    if (!response.ok) {
        throw new Error('Failed to fetch class projects');
    }

    return response.json();
};


export const deleteClassById = async (id) => {
    try {
        const response = await fetch(`${apiBaseUrl}/api/Classes/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error("Failed to delete class");
        }

        return true;
    } catch (error) {
        console.error("Error deleting class:", error);
        return false;
    }
};


export const getExamsForInstructor = async (classId) => {
    const response = await fetch(`${apiBaseUrl}/api/Exam/instructor/class/${classId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
    });

    if (!response.ok) {
        throw new Error('Failed to fetch class assignments');
    }

    return response.json();
};

export const getExamsForStudent = async (classId) => {
    const response = await fetch(`${apiBaseUrl}/api/Exam/Student/class/${classId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
    });

    if (!response.ok) {
        throw new Error('Failed to fetch class assignments');
    }

    return response.json();
};


export const leaveClassById = async (classId, token) => {
    try {
        const response = await fetch(`${apiBaseUrl}/api/StudentClass/${classId}/Leave`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("API Error Response:", errorText);
            throw new Error("Failed to leave class");
        }

        return true;
    } catch (error) {
        console.error("Error leaving class:", error);
        return false;
    }
};


export const removeStudentFromClass = async (classId, studentId, signal) => {
    try {
        const response = await fetch(
            `${apiBaseUrl}/api/StudentClass/${classId}/Students/remove/${studentId}`,
            {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                signal,
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Server response:", errorText);
            throw new Error("Failed to remove student from class");
        }

        return true;
    } catch (error) {
        console.error("Error removing student from class:", error);
        return false;
    }
};

