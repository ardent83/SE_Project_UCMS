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

/**
 * Deletes a class.
 * @param {string} classId - The ID of the class to delete.
 * @returns {Promise<void>}
 */
export const deleteClassById = async (classId) => {
    const response = await fetch(`${apiBaseUrl}/api/Classes/${classId}`, {
        method: 'DELETE',
        credentials: 'include',
    });

    if (!response.ok) {
        const error = new Error(`HTTP error! Status: ${response.status}`);
        error.status = response.status;
        throw error;
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

/**
 * leave a class.
 * @param {string} classId - The ID of the class to leave.
 * @returns {Promise<void>}
 */
export const leaveClassById = async (classId) => {
    const response = await fetch(`${apiBaseUrl}/api/StudentClass/${classId}/Leave`, {
        method: 'DELETE',
        credentials: 'include',
    });

    if (!response.ok) {
        const error = new Error(`HTTP error! Status: ${response.status}`);
        error.status = response.status;
        throw error;
    }
};

/**
 * remove student from a class.
 * @param {string} classId  - The ID of the class to remove.
 * @param {string} studentId  - The ID of the student to remove.
 * @returns {Promise<void>}
 */
export const removeStudentFromClass = async (classId, studentId) => {
    const response = await fetch(`${apiBaseUrl}/api/StudentClass/${classId}/Students/remove/${studentId}`, {
        method: 'DELETE',
        credentials: 'include',
    });

    if (!response.ok) {
        const error = new Error(`HTTP error! Status: ${response.status}`);
        error.status = response.status;
        throw error;
    }
};
