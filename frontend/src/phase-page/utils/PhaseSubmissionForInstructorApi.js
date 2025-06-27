const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;


export const uploadGradesFile = async (phaseId, file) => {
    if (!file) {
        throw new Error("FileIsNeeded");
    }

    const apiEndpoint = `${apiBaseUrl}/api/PhaseSubmissions/${phaseId}/scores`;

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
 * Downloads the template of score file for phase.
 * @param {string} phaseId - The ID of the phase.
 * @returns {Promise<void>}
 */
export const downloadScoreTemplateFileApi = async (phaseId) => {
    let downloadEndpoint = `${apiBaseUrl}/api/PhaseSubmissions/template/${phaseId}`;


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


/**
 * Downloads the template of score file for phase.
 * @param {string} phaseId - The ID of the phase.
 * @returns {Promise<void>}
 */
export const downloadAllSubmissionFilesApi = async (phaseId) => {
    let downloadEndpoint = `${apiBaseUrl}/api/PhaseSubmissions/${phaseId}`;


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

export const getStudentsOfTeam = async (phaseId,teamId) => {
    try {
        const res = await fetch(`${apiBaseUrl}/api/PhaseSubmissions/${phaseId}/${teamId}/members`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
            },
        });

        if (!res.ok) throw new Error('Error in catching phase info');

        return await res.json();
    } catch (error) {
        console.error('Error:', error.message);
        throw error;
    }
};

export const setScoreForEachStudent = async (studentId, score) => {
    if (!studentId) {
        throw new Error("شناسه ارسال معتبر نیست!");
    }
    if (typeof score !== "number") {
        throw new Error("نمره باید عدد باشد!");
    }
    const apiEndpoint = `${apiBaseUrl}/api/PhaseSubmissions/score/${studentId}`;
    try {
        const response = await fetch(apiEndpoint, {
            method: "PATCH",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ score }),
        });

        if (!response.ok) {
            const error = new Error(`HTTP error! Status: ${response.status}`);
            error.status = response.status;
            try {
                const errorData = await response.json();
                error.message = errorData.message || error.message;
            } catch (jsonError) {}
            throw error;
        }

        const result = await response.json();
        return {
            success: true,
            message: result.message || "نمره با موفقیت ثبت شد.",
            data: result.data || null,
        };
    } catch (err) {
        console.error("Error setting score:", err);
        return {
            success: false,
            message: err.message || "خطای ناشناخته در ثبت نمره.",
        };
    }
};
