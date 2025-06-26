const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;


export const submitStudentSubmissionApi = async (phaseId, file) => {
    if (!file) {
        throw new Error("FileIsNeeded");
    }

    const apiEndpoint = `${apiBaseUrl}/api/PhaseSubmissions/${phaseId}`;

    const formData = new FormData();
    formData.append('SubmissionFile', file);
    try {
        const response = await fetch(apiEndpoint, {
            method: 'POST',
            credentials: 'include',
            body: formData,
        });

        if (!response.ok) {
            const error = new Error(`HTTP error! Status: ${response.status}`);
            error.status = response.status;
            try {
                const errorData = await response.json();
                error.message = errorData.message || error.message;
            } catch (jsonError) {
            }
            throw error;
        }
        return await response.json();
    } catch (err) {
        console.error("Error submitting student answer:", err);
        throw err;
    }
};

export const fetchPhaseSubmissionsApi = async (phaseId, userRole, filterDto = {}) => {
    if (!phaseId) throw new Error("شناسه فاز معتبر نیست!");

    const queryParams = new URLSearchParams({ PhaseId: phaseId });

    if (filterDto.SortBy !== undefined) {
        queryParams.append("SortBy", filterDto.SortBy);
        if (filterDto.SortOrder !== undefined) {
            queryParams.append("SortOrder", filterDto.SortOrder);
        }
    }

    const endpoint =
        userRole === "Student"
            ? `${apiBaseUrl}/api/PhaseSubmissions/student?${queryParams}`
            : `${apiBaseUrl}/api/PhaseSubmissions/instructor?${queryParams}`;

    const response = await fetch(endpoint, { credentials: "include" });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "خطا در دریافت ارسال‌های فاز");
    }

    const result = await response.json();
    return {
        items: result.data || [],
        success: result.success,
        message: result.message,
    };
};


export const setFinalSubmission = async (submissionId, isFinalStatus) => {
    if (!submissionId) {
        throw new Error("شناسه ارسال معتبر نیست!");
    }

    const apiEndpoint = `${apiBaseUrl}/api/PhaseSubmissions/final/${submissionId}`;

    console.log(`Updating final status of phase submission ${submissionId} to: ${isFinalStatus}`);

    try {
        const response = await fetch(apiEndpoint, {
            method: "PATCH",
            credentials: "include", // اگر کوکی یا auth داری
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ isFinal: isFinalStatus }),
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
            message: result.message || "وضعیت نهایی با موفقیت به‌روزرسانی شد.",
            data: result.data || null,
        };
    } catch (err) {
        console.error("Error updating final submission status:", err);
        return {
            success: false,
            message: err.message || "خطای ناشناخته در بروزرسانی نهایی بودن ارسال.",
        };
    }
};

/**
 * Downloads the phase submission file.
 * @param {string} phaseSubmissionId  - The ID of the submission file.
 * @param {string} userRole - The role of the current user.
 * @param {string} submissionContentType - The content type of the file (e.g., 'application/pdf').
 * @returns {Promise<void>}
 */
export const downloadSubmissionFileApi = async (phaseSubmissionId ,userRole,submissionContentType) => {
    let downloadEndpoint;
    if (userRole === "Instructor") {
        downloadEndpoint = `${apiBaseUrl}/api/PhaseSubmissions/instructor${phaseSubmissionId}`;
    } else if (userRole === "Student") {
        downloadEndpoint = `${apiBaseUrl}/api/PhaseSubmissions/student/${phaseSubmissionId}`;
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
    const fileExtension = submissionContentType ? submissionContentType.split("/")[1] : "bin";
    a.download = `phaseSubmission_${phaseSubmissionId}.${fileExtension}`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
};