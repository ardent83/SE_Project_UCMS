const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;


export const getPhaseInformationForInstructor = async (phaseId) => {
    try {
        const res = await fetch(`${apiBaseUrl}/api/Phase/Instructor/${phaseId}`, {
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

export const getPhaseInformationForStudent = async (phaseId) => {
    try {
        const res = await fetch(`${apiBaseUrl}/api/Phase/Student/${phaseId}`, {
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


/**
 * Downloads the project file.
 * @param {string} phaseId - The ID of the project.
 * @param {string} userRole - The role of the current user.
 * @param {string} phaseFileContentType - The content type of the file (e.g., 'application/pdf').
 * @param {string} phaseTitle - The title of the project for naming the downloaded file.
 * @returns {Promise<void>}
 */

export const downloadPhaseFileApi = async (phaseId,userRole,phaseFileContentType,phaseTitle) => {
    let downloadEndpoint;
    if (userRole === "Instructor") {
        downloadEndpoint = `${apiBaseUrl}/api/Phase/${phaseId}/downloadForInstructor`;
    } else if (userRole === "Student") {
        downloadEndpoint = `${apiBaseUrl}/api/Phase/${phaseId}/downloadForStudent`;
    } else {
        throw new Error("نقش کاربر پشتیبانی نمی‌شود!");
    }

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
    const fileExtension = phaseFileContentType ? phaseFileContentType.split("/")[1] : "bin";
    a.download = `${phaseTitle || 'project'}_${phaseId}.${fileExtension}`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
};
