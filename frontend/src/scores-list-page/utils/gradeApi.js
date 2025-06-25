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

/**
 * Fetches grading entries (quizzes, phases, midterms, etc.) for a specific class.
 * URL: GET /api/Classes/{classId}/entries
 * @param {string} classId - The ID of the class.
 * @returns {Promise<Array>} Array of class entries (grading criteria).
 */
export const fetchClassEntries = async (classId) => {
    if (!classId) {
        throw new Error("شناسه کلاس معتبر نیست!");
    }
    const apiEndpoint = `${API_BASE_URL}/api/Classes/${classId}/entries`;
    console.log(`Fetching class entries for class ${classId} from: ${apiEndpoint}`);
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
        return result.data || []; 
    } catch (err) {
        console.error(`Error fetching class entries for class ${classId}:`, err);
        throw err;
    }
};

/**
 * Updates grading entries (quizzes, phases, midterms, etc.) for a specific class.
 * URL: PATCH /api/Classes/{classId}/entries
 * Body: { entryDtos: Array<{ entryId, entryType, portionInTotalScore }>, totalScore: number }
 * @param {string} classId - The ID of the class.
 * @param {Array} entryDtos - Array of updated entry DTOs.
 * @param {number} totalScore - The new total score for the class (e.g., 20).
 * @returns {Promise<object>} Success/error response.
 */
export const updateClassEntries = async (classId, entryDtos, totalScore) => {
    if (!classId || !entryDtos || !Array.isArray(entryDtos)) {
        throw new Error("شناسه کلاس یا داده‌های آیتم‌های نمره‌دهی معتبر نیست!");
    }
    const apiEndpoint = `${API_BASE_URL}/api/Classes/${classId}/entries`;
    const requestBody = {
        entryDtos: entryDtos.map(entry => ({
            entryId: entry.entryId,
            entryType: entry.entryType,
            portionInTotalScore: entry.portionInTotalScore,
            partialScore: entry.partialScore
        })),
        totalScore: totalScore
    };
    console.log("Sending request to:", apiEndpoint);
console.log("Request body:", JSON.stringify(requestBody, null, 2));

    console.log(`Updating class entries for class ${classId} to:`, requestBody);
    try {
        const response = await fetch(apiEndpoint, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(requestBody),
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
        return { success: result.success, message: result.message || "اطلاعات نمره‌دهی با موفقیت به‌روز شد." };
    } catch (err) {
        console.error(`Error updating class entries for class ${classId}:`, err);
        throw err;
    }
};

/**
 * MOCK: Fetches a list of students with their grades for an instructor's class.
 * This is a placeholder. YOU NEED TO PROVIDE THE REAL API CURL/DETAILS FOR THIS.
 * Example URL: GET /api/Classes/{classId}/students/grades
 * @param {string} classId - The ID of the class.
 * @returns {Promise<Array>} Array of student grade summaries.
 */
export const fetchInstructorStudentsGrades = async (classId) => { // Added this export
    console.log(`Mock API: Fetching instructor student grades for class ${classId}`);
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay
    // This mock data should match the expected structure in GradeReportPageInstructor
    return [
        { id: 1, firstName: 'فاطمه', lastName: 'صیادزاده', quiz3: 12, phase1: 12, phase2: 12, midterm: 12, finalTerm: 12, overall: 12 },
        { id: 2, firstName: 'کیمیا', lastName: 'کبیری', quiz3: 14, phase1: 13, phase2: 14, midterm: 14, finalTerm: 14, overall: 14 },
        { id: 3, firstName: 'محمد مهدی', lastName: 'محسن پور', quiz3: 10, phase1: 1, phase2: 10, midterm: 8, finalTerm: 7, overall: 1 },
        { id: 4, firstName: 'علی', lastName: 'احمدی', quiz3: 18, phase1: 19, phase2: 17, midterm: 20, finalTerm: 19, overall: 18 },
        { id: 5, firstName: 'فاطمه زهرا', lastName: 'فتحیان', quiz3: 9, phase1: 7, phase2: 8, midterm: 6, finalTerm: 5, overall: 7 },
        { id: 6, firstName: 'حنانه', lastName: 'نوروطن', quiz3: 11, phase1: 10, phase2: 12, midterm: 11, finalTerm: 10, overall: 11 },
        { id: 7, firstName: 'زینب', lastName: 'صادقی', quiz3: 15, phase1: 16, phase2: 15, midterm: 17, finalTerm: 16, overall: 16 },
        { id: 8, firstName: 'بهار', lastName: 'مرادی', quiz3: 13, phase1: 14, phase2: 13, midterm: 12, finalTerm: 13, overall: 13 },
    ];
};
