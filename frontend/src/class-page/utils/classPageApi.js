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



export const getStudentOfClassForInstructor = async (classId) => {
    const response = await fetch(`${apiBaseUrl}/api/StudentClass/${classId}/students`, {
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

export const getStudentOfClassForStudent = async (classId) => {
    const response = await fetch(`${apiBaseUrl}/api/StudentClass/classStudent/${classId}/students`, {
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

export const getProjectsForInstructor = async () => {
    const response = await fetch(`${apiBaseUrl}/api/Project/instructor`, {
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

export const getProjectsForStudent = async () => {
    const response = await fetch(`${apiBaseUrl}/api/Project/Student`, {
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

export const getAssignmentsForInstructor = async (classId) => {
    const response = await fetch(`${apiBaseUrl}/api/Exercise/instructor?classId=${classId}`, {
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
    const response = await fetch(`${apiBaseUrl}/api/Exercise/Student?classId=${classId}`, {
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

export const getExamsForInstructor = async (classId) => {
    const response = await fetch(`${apiBaseUrl}/api/Exam/instructor?classId=${classId}`, {
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
    const response = await fetch(`${apiBaseUrl}/api/Exam/Student?classId=${classId}`, {
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



