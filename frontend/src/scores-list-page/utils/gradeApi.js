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
            } catch (jsonError) {
               // json response??
            }
            throw error;
        }

        const result = await response.json();
        const entries = result?.data?.entryDtos || [];
        const totalScore = result?.data?.sumOfSPartialScores ?? 0;

        return { entries, totalScore }; 

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
 * Fetches students' scores for a specific class (instructor view).
 * URL: GET /api/Classes/{classId}/students/scores
 * @param {string} classId - The ID of the class.
 * @returns {Promise<Object>} Object containing headers and student scores.
 */
export const fetchStudentClassScores = async (classId) => {
    if (!classId) {
        throw new Error("شناسه کلاس معتبر نیست!");
    }
    const apiEndpoint = `${API_BASE_URL}/api/StudentClass/${classId}/students/scores`;
    console.log(`Fetching student class scores for class ${classId} from: ${apiEndpoint}`);
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
        console.log(result.data)
        return result.data || null; // Assuming response has a 'data' field
    } catch (err) {
        console.error(`Error fetching student class scores for class ${classId}:`, err);
        throw err;
    }
};

/**
 * Fetches export file (Excel/PDF) of students' scores for a specific class.
 * URL: GET /api/StudentClass/{classId}/students/scores/export
 * @param {string} classId - The ID of the class.
 * @returns {Promise<Blob>} Blob of the exported file.
 */
export const fetchStudentClassScoresExport = async (classId) => {
  if (!classId) {
    throw new Error("شناسه کلاس معتبر نیست!");
  }
  const apiEndpoint = `${API_BASE_URL}/api/StudentClass/${classId}/students/scores/export`;
  console.log(`Fetching export file for class ${classId} from: ${apiEndpoint}`);

  try {
    const response = await fetch(apiEndpoint, {
      method: "GET",
      credentials: "include",
      headers: {
        'Accept': '*/*',
      },
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

    const blob = await response.blob();
    return blob;
  } catch (err) {
    console.error(`Error fetching export file for class ${classId}:`, err);
    throw err;
  }
};


