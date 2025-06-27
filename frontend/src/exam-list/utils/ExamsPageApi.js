
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

/**
 * Deletes an exam.
 * @param {string} examId - The ID of the exam to delete.
 * @returns {Promise<void>}
 */
export const deleteExamById = async (examId) => {
    const response = await fetch(`${apiBaseUrl}/api/Exam/${examId}`, {
        method: 'DELETE',
        credentials: 'include',
    });

    if (!response.ok) {
        const error = new Error(`HTTP error! Status: ${response.status}`);
        error.status = response.status;
        throw error;
    }
};


export const uploadGradesFile = async (examId, file) => {
    if (!file) {
        throw new Error("FileIsNeeded");
    }

    const apiEndpoint = `${apiBaseUrl}/api/StudentExam/${examId}/scores`;

    const formData = new FormData();
    formData.append('scoreFile', file);

    const response = await fetch(apiEndpoint, {
        method: 'PATCH',
        credentials: 'include',
        body: formData,
    });

    let data;
    try {
        data = await response.json();
    } catch (err) {
        throw new Error(`Invalid response from server with status: ${response.status}`);
    }

    if (!response.ok) {
        const errorMessage = data?.message || `HTTP error! Status: ${response.status}`;
        const error = new Error(errorMessage);
        error.status = response.status;
        error.data = data;
        throw error;
    }

    return data;
};


/**
 * Downloads the template of score file for exam.
 * @param {string} examId - The ID of the exam.
 * @returns {Promise<void>}
 */
export const downloadScoreTemplateFileApi = async (examId) => {
    let downloadEndpoint = `${apiBaseUrl}/api/StudentExam/template/${examId}`;


    const response = await fetch(downloadEndpoint, {
        method: "GET",
        credentials: "include",
    });

    if (!response.ok) {
        const error = new Error(`HTTP error! Status: ${response.status}`);
        error.status = response.status;
        throw error;
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
};
