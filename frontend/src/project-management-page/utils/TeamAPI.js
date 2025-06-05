const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Fetches teams for a specific project based on user role.
 * @param {string} projectId - The ID of the project.
 * @param {string} userRole - The role of the current user ('Instructor' or 'Student').
 * @returns {Promise<Array>} List of teams.
 */
export const fetchTeamsApi = async (projectId, userRole) => { 
    if (!projectId) return [];

    let apiEndpoint;
    if (userRole === "Instructor") {
        apiEndpoint = `${API_BASE_URL}/api/Teams/instructor/project/${projectId}/teams`;
    } else if (userRole === "Student") {
        apiEndpoint = `${API_BASE_URL}/api/Teams/student/project/${projectId}/teams`;
    } else {
        return []; 
    }

    console.log("Fetching teams from:", apiEndpoint);
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
 * Fetches members for a specific team.
 * @param {string} teamId - The ID of the team.
 * @param {string} userRole - The role of the current user ('Instructor' or 'Student').
 * @returns {Promise<Array>} List of team members.
 */
export const fetchTeamMembersApi = async (teamId, userRole) => {
    if (!teamId) {
        throw new Error("شناسه تیم معتبر نیست!");
    }

    let apiEndpoint;
    if (userRole === "Instructor") {
        apiEndpoint = `${API_BASE_URL}/api/Teams/instructor/${teamId}`; 
    } else if (userRole === "Student") {
        apiEndpoint = `${API_BASE_URL}/api/Teams/student/${teamId}`; 
    } else {
        throw new Error("نقش کاربر پشتیبانی نمی‌شود یا دسترسی برای دریافت اعضا وجود ندارد!");
    }

    console.log(`Fetching team members for team ${teamId} from:`, apiEndpoint);
    const response = await fetch(apiEndpoint, {
        method: "GET",
        credentials: "include",
    });

    if (!response.ok) {
        const error = new Error(`HTTP error! Status: ${response.status}`);
        error.status = response.status;
        throw error;
    }
    const data = await response.json();
    return data.studentTeams || [];
};