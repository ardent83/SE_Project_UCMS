const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Fetches overall scores for all classes for a student.
 * URL: GET /api/StudentClass/scores
 * @returns {Promise<Array>} Array of class scores.
 */
export const fetchStudentOverallScores = async () => {
    const apiEndpoint = `${API_BASE_URL}/api/StudentClass/scores`;
    console.log(`Fetching student overall scores from: ${apiEndpoint}`);
    try {
        const response = await fetch(apiEndpoint, {
            method: "GET",
            credentials: "include",
        });

        if (!response.ok) {
            const error = new Error(`HTTP error! Status: ${response.status}`);
            error.status = response.status;
            try {
                const errorData = await response.json();
                error.message = errorData.message || error.message;
            } catch (jsonError) { /* ignore */ }
            throw error;
        }
        const result = await response.json();
        return result.data || []; // Assuming data is in 'data' property
    } catch (err) {
        console.error("Error fetching student overall scores:", err);
        throw err;
    }
};

/**
 * Fetches detailed scores for a specific class for a student.
 * URL: GET /api/StudentClass/{classId}/scores
 * @param {string} classId - The ID of the class.
 * @returns {Promise<Array>} Array of detailed score entries for the class.
 */
export const fetchStudentDetailedScoresByClassId = async (classId) => {
    if (!classId) {
        throw new Error("شناسه کلاس معتبر نیست!");
    }
    const apiEndpoint = `${API_BASE_URL}/api/StudentClass/${classId}/scores`;
    console.log(`Fetching student detailed scores for class ${classId} from: ${apiEndpoint}`);
    try {
        const response = await fetch(apiEndpoint, {
            method: "GET",
            credentials: "include",
        });

        if (!response.ok) {
            const error = new Error(`HTTP error! Status: ${response.status}`);
            error.status = response.status;
            try {
                const errorData = await response.json();
                error.message = errorData.message || error.message;
            } catch (jsonError) { /* ignore */ }
            throw error;
        }
        const result = await response.json();
        return result.data || []; // Assuming data is in 'data' property
    } catch (err) {
        console.error(`Error fetching student detailed scores for class ${classId}:`, err);
        throw err;
    }
};