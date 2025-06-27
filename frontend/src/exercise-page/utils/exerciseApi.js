const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchExerciseDetailsApi = async (exerciseId, userRole) => {
    if (!exerciseId) {
        throw new Error("شناسه تمرین معتبر نیست!");
    }

    let apiEndpoint;
    if (userRole === "Instructor") {
        apiEndpoint = `${API_BASE_URL}/api/Exercise/Instructor/${exerciseId}`;
    } else if (userRole === "Student") {
        apiEndpoint = `${API_BASE_URL}/api/Exercise/Student/${exerciseId}`;
    } else {
        throw new Error("نقش کاربر پشتیبانی نمی‌شود یا دسترسی به تمرین وجود ندارد!");
    }

    console.log(`Fetching exercise details from: ${apiEndpoint}`);
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
        }
        throw error;
    }
    return await response.json();
};

export const fetchExerciseSubmissionsApi = async (exerciseId, userRole, filterDto = {}) => {
  if (!exerciseId) {
    throw new Error("شناسه تمرین معتبر نیست!");
  }

  const queryParams = new URLSearchParams();
  queryParams.append("ExerciseId", exerciseId);

  if (filterDto.SortBy !== undefined) {
    queryParams.append("SortBy", filterDto.SortBy);

    if (filterDto.SortBy !== 0 && filterDto.SortOrder !== undefined) {
      queryParams.append("SortOrder", filterDto.SortOrder);
    }
  }

  const params = queryParams.toString();

  let apiEndpoint;
  if (userRole === "Instructor") {
    apiEndpoint = `${API_BASE_URL}/api/ExerciseSubmissions/instructor?${params}`;
  } else if (userRole === "Student") {
    apiEndpoint = `${API_BASE_URL}/api/ExerciseSubmissions/student?${params}`;
  } else {
    throw new Error("نقش کاربر پشتیبانی نمی‌شود یا دسترسی به ارسال‌ها وجود ندارد!");
  }

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
      } catch {}

      throw error;
    }

    const result = await response.json();

    return {
      items: result.data || [],
      success: result.success,
      message: result.message,
    };
  } catch (err) {
    console.error("Error fetching exercise submissions:", err);
    throw err;
  }
};

export const submitGradeApi = async (exerciseSubmissionId, scoreValue) => { // Renamed 'score' to 'scoreValue' for clarity
    if (!exerciseSubmissionId || scoreValue === undefined || scoreValue === null) {
        throw new Error("شناسه ارسال یا نمره معتبر نیست!");
    }

    const apiEndpoint = `${API_BASE_URL}/api/ExerciseSubmissions/score/${exerciseSubmissionId}`;
    const requestBody = { score: scoreValue };

    console.log(`Submitting grade for submission ${exerciseSubmissionId}, Score: ${scoreValue}`);
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
        return await response.json();
    } catch (err) {
        console.error("Error submitting grade:", err);
        throw err;
    }
};

export const submitStudentSubmissionApi = async (exerciseId, file) => {
    console.log("2. submitStudentSubmissionApi: file parameter =", file); // Debugging log
    if (!file) {
        throw new Error("FileIsNeeded");
    }

    const apiEndpoint = `${API_BASE_URL}/api/ExerciseSubmissions/${exerciseId}`;

    const formData = new FormData();
    formData.append('SubmissionFile', file); 

    console.log(`Submitting student's answer for exercise ${exerciseId}. File: ${file?.name}, Desc: (not sent)`);
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

export const downloadSubmissionFileApi = async (exerciseSubmissionId, userRole, fileName) => { 
    if (!exerciseSubmissionId) {
        throw new Error("شناسه ارسال برای دانلود معتبر نیست!");
    }

    let apiEndpoint;
    if (userRole === "Instructor") {
        apiEndpoint = `${API_BASE_URL}/api/ExerciseSubmissions/instructor/${exerciseSubmissionId}`;
    } else if (userRole === "Student") {
        apiEndpoint = `${API_BASE_URL}/api/ExerciseSubmissions/student/${exerciseSubmissionId}`;
    } else {
        throw new Error("نقش کاربر پشتیبانی نمی‌شود یا دسترسی به دانلود ارسال وجود ندارد!");
    }

    console.log(`Downloading submission file from: ${apiEndpoint}`);
    try {
        const response = await fetch(apiEndpoint, {
            method: 'GET',
            credentials: 'include',
        });

        if (!response.ok) {
            const error = new Error(`HTTP error! Status: ${response.status}`);
            error.status = response.status;
            try {
                const errorData = await response.json();
                error.message = errorData.message || error.message;
            } catch (jsonError) { }
            throw error;
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;

        a.download = fileName || `submission_${exerciseSubmissionId}_download.file`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
        console.log(`File ${fileName} downloaded successfully.`);
    } catch (err) {
        console.error("Error downloading submission file:", err);
        throw err;
    }
};

export const downloadExerciseFileApi = async (exerciseId, userRole, fileName) => {
    if (!exerciseId) {
        throw new Error("شناسه تمرین برای دانلود معتبر نیست!");
    }

    let apiEndpoint;
    if (userRole === "Instructor") {
        apiEndpoint = `${API_BASE_URL}/api/Exercise/${exerciseId}/downloadForInstructor`;
    } else if (userRole === "Student") {
        apiEndpoint = `${API_BASE_URL}/api/Exercise/${exerciseId}/downloadForStudent`;
    } else {
        throw new Error("نقش کاربر پشتیبانی نمی‌شود یا دسترسی به دانلود فایل تمرین وجود ندارد!");
    }

    console.log(`Downloading exercise file from: ${apiEndpoint}`);
    try {
        const response = await fetch(apiEndpoint, {
            method: 'GET',
            credentials: 'include',
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

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName || `exercise_${exerciseId}.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
        console.log(`File ${fileName} downloaded successfully.`);
    } catch (err) {
        console.error("Error downloading exercise file:", err);
        throw err;
    }
};

export const downloadAllExerciseFileApi = async (exerciseId, userRole) => {
    if (!exerciseId) {
        throw new Error("شناسه تمرین برای دانلود معتبر نیست!");
    }
    console.log("Downloading file for exerciseId:", exerciseId);

    const apiEndpoint = `${API_BASE_URL}/api/ExerciseSubmissions/${exerciseId}`;

    try {
        const response = await fetch(apiEndpoint, {
            method: 'GET',
            credentials: 'include',
        });

        console.log('Response status:', response.status);
        console.log('Content-Type:', response.headers.get('Content-Type'));

        if (!response.ok) {
            const error = new Error(`HTTP error! Status: ${response.status}`);
            error.status = response.status;
            try {
                const errorData = await response.json();
                error.message = errorData.message || error.message;
            } catch {}
            throw error;
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `exercise_${exerciseId}.zip`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
    } catch (err) {
        console.error("Error downloading exercise file:", err);
        throw err;
    }
};


export const deleteExerciseApi = async (exerciseId) => {
    if (!exerciseId) {
        throw new Error("شناسه تمرین برای حذف معتبر نیست!");
    }

    const apiEndpoint = `${API_BASE_URL}/api/Exercise/${exerciseId}`;

    console.log(`Deleting exercise ${exerciseId} from: ${apiEndpoint}`);
    try {
        const response = await fetch(apiEndpoint, {
            method: 'DELETE',
            credentials: 'include',
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
        console.log(`Exercise ${exerciseId} deleted successfully from backend.`);
    } catch (err) {
        console.error("Error deleting exercise:", err);
        throw err;
    }
};

export const updateExerciseSubmissionScoresApi = async (exerciseId, scoreFile) => {
    if (!exerciseId || !scoreFile) {
        throw new Error("شناسه تمرین یا فایل نمره معتبر نیست!");
    }

    const apiEndpoint = `${API_BASE_URL}/api/ExerciseSubmissions/${exerciseId}/scores`; // PUT endpoint

    const formData = new FormData();
    formData.append('scoreFile', scoreFile);

    console.log(`Uploading scores for exercise ${exerciseId}, file: ${scoreFile.name}`);
    try {
        const response = await fetch(apiEndpoint, {
            method: 'PATCH',
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
    }
    catch (err) {
        console.error("Error uploading scores:", err);
        throw err;
    }
};

export const getExerciseScoreTemplateFileApi = async (exerciseId) => {
    if (!exerciseId) {
        throw new Error("شناسه تمرین برای دانلود قالب نمره معتبر نیست!");
    }

    const apiEndpoint = `${API_BASE_URL}/api/ExerciseSubmissions/template/${exerciseId}`;

    console.log(`Downloading score template for exercise ${exerciseId} from: ${apiEndpoint}`);
    try {
        const response = await fetch(apiEndpoint, {
            method: 'GET',
            credentials: 'include',
        });

        if (!response.ok) {
            const error = new Error(`HTTP error! Status: ${response.status}`);
            error.status = response.status;
            try {
                const errorData = await response.json();
                error.message = errorData.message || error.message;
            }
            catch (jsonError) {
            }
            throw error;
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `exercise_${exerciseId}_score_template.xlsx`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
        console.log(`Score template for exercise ${exerciseId} downloaded successfully.`);
    } catch (err) {
        console.error("Error downloading score template:", err);
        throw err;
    }
};

export const updateFinalExerciseSubmissionApi = async (submissionId, isFinalStatus) => {
    if (!submissionId) {
        throw new Error("شناسه ارسال معتبر نیست!");
    }

    const apiEndpoint = `${API_BASE_URL}/api/ExerciseSubmissions/final/${submissionId}`;

    console.log(`Updating final status of submission ${submissionId} to: ${isFinalStatus}`);

    try {
        const response = await fetch(apiEndpoint, {
            method: "PATCH",
            credentials: "include",
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

