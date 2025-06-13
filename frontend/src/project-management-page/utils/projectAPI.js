const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Fetches project details based on user role and project ID.
 * @param {string} projectId - The ID of the project.
 * @param {string} userRole - The role of the current user ('Instructor' or 'Student').
 * @returns {Promise<object>} The project data.
 */
export const fetchProjectApi = async (projectId, userRole) => {
    if (!projectId) {
        throw new Error("شناسه پروژه معتبر نیست!");
    }

    let apiEndpoint;
    if (userRole === "Instructor") {
        apiEndpoint = `${API_BASE_URL}/api/Project/Instructor/${projectId}`;
    } else if (userRole === "Student") {
        apiEndpoint = `${API_BASE_URL}/api/Project/Student/${projectId}`;
    } else {
        throw new Error("نقش کاربر پشتیبانی نمی‌شود!");
    }

    console.log("Fetching project from:", apiEndpoint);
    const response = await fetch(apiEndpoint, {
        method: "GET",
        credentials: "include",
    });

    if (!response.ok) {
        const error = new Error(`HTTP error! Status: ${response.status}`);
        error.status = response.status;
        throw error;
    }
    return await response.json();
};

/**
 * Fetches phases for a specific project based on user role.
 * @param {string} projectId - The ID of the project.
 * @param {string} userRole - The role of the current user ('Instructor' or 'Student').
 * @returns {Promise<Array>} List of phases.
 */
export const fetchPhasesApi = async (projectId, userRole) => {
    if (!projectId) return []; // No phases if no project ID

    let apiEndpoint = `${API_BASE_URL}/api/Phase/${userRole}?projectId=${projectId}`;
    console.log("Fetching phases from:", apiEndpoint);
    const response = await fetch(apiEndpoint, {
        method: "GET",
        credentials: "include",
    });

    if (!response.ok) {
        const error = new Error(`HTTP error! Status: ${response.status}`);
        error.status = response.status;
        throw error;
    }
    return await response.json();
};

/**
 * Downloads the project file.
 * @param {string} projectId - The ID of the project.
 * @param {string} userRole - The role of the current user.
 * @param {string} projectFileContentType - The content type of the file (e.g., 'application/pdf').
 * @param {string} projectTitle - The title of the project for naming the downloaded file.
 * @returns {Promise<void>}
 */
export const downloadProjectFileApi = async (projectId, userRole, projectFileContentType, projectTitle) => {
    let downloadEndpoint;
    if (userRole === "Instructor") {
        downloadEndpoint = `${API_BASE_URL}/api/Project/${projectId}/downloadForInstructor`;
    } else if (userRole === "Student") {
        downloadEndpoint = `${API_BASE_URL}/api/Project/${projectId}/downloadForStudent`;
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
    const fileExtension = projectFileContentType ? projectFileContentType.split("/")[1] : "bin";
    a.download = `${projectTitle || 'project'}_${projectId}.${fileExtension}`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
};


/**
 * Deletes a project.
 * @param {string} projectId - The ID of the project to delete.
 * @returns {Promise<void>}
 */
export const deleteProjectApi = async (projectId) => {
    const response = await fetch(`${API_BASE_URL}/api/Project/${projectId}`, {
        method: 'DELETE',
        credentials: 'include',
    });

    if (!response.ok) {
        const error = new Error(`HTTP error! Status: ${response.status}`);
        error.status = response.status;
        throw error;
    }
};
