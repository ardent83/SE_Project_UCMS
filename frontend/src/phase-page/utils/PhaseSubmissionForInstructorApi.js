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
        // اگر پاسخ JSON نبود یا خطا داشت، داده‌ای نداریم
        throw new Error(`Invalid response from server with status: ${response.status}`);
    }

    if (!response.ok) {
        // اگر response خطا داشت، پیام خطا رو از داده بفرست (اگر داشت)
        const errorMessage = data?.message || `HTTP error! Status: ${response.status}`;
        const error = new Error(errorMessage);
        error.status = response.status;
        error.data = data; // میتونی کل data رو هم اینجا نگه داری
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
    // const fileExtension = phaseFileContentType ? phaseFileContentType.split("/")[1] : "bin";
    // a.download = `${phaseTitle || 'project'}_${phaseId}.${fileExtension}`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
};
