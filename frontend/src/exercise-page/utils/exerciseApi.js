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
            // If the response is not JSON, use the default message
        }
        throw error;
    }
    return await response.json();
};

/**
 * Fetches detailed submissions for a specific exercise for Instructor or Student.
 * (این تابع حالا Mock است)
 * @param {string} exerciseId - The ID of the exercise.
 * @param {string} userRole - 'Instructor' or 'Student'.
 * @param {object} filterDto - Filter DTO for submissions (SortExerciseSubmissionsForInstructorDto or SortExerciseSubmissionsStudentDto)
 * @returns {Promise<object>} An object containing submission items, totalPages, etc. (response.items)
 */
export const fetchExerciseSubmissionsApi = async (exerciseId, userRole, filterDto = {}) => {
    console.log(`Mock API: Fetching submissions for exercise ${exerciseId} as ${userRole} with filters:`, filterDto);
    await new Promise(resolve => setTimeout(resolve, 700)); // Simulate network delay

    // <-- Mock Data برای ارسال‌ها -->
    const mockSubmissions = [
        { id: 'sub1', groupId: 'groupA', groupName: 'گروه ستاره', submissionTime: '2025-06-20T10:00:00Z', fileType: 'pdf', grade: null, submitted: false, fileUrl: 'mock_file_a.pdf', studentId: 'stu1' },
        { id: 'sub2', groupId: 'groupB', groupName: 'گروه ماه', submissionTime: '2025-06-21T14:30:00Z', fileType: 'zip', grade: 18, submitted: true, fileUrl: 'mock_file_b.zip', studentId: 'stu2' },
        { id: 'sub3', groupId: 'groupC', groupName: 'گروه خورشید', submissionTime: '2025-06-22T09:15:00Z', fileType: 'rar', grade: null, submitted: false, fileUrl: 'mock_file_c.rar', studentId: 'stu3' },
        { id: 'sub4', groupId: 'groupD', groupName: 'گروه نپتون', submissionTime: '2025-06-19T08:00:00Z', fileType: 'docx', grade: 15, submitted: true, fileUrl: 'mock_file_d.docx', studentId: 'stu4' },
        { id: 'sub5', groupId: 'groupE', groupName: 'گروه مشتری', submissionTime: '2025-06-23T16:00:00Z', fileType: 'pptx', grade: null, submitted: false, fileUrl: 'mock_file_e.pptx', studentId: 'stu5' },
    ];

    // پیاده‌سازی ساده برای مرتب‌سازی Mock data
    let sortedSubmissions = [...mockSubmissions];
    if (filterDto.SortBy !== undefined) {
        if (userRole === "Instructor") {
            // SortBy: 0 = Date, 1 = StudentName
            if (filterDto.SortBy === 0) { // Date
                sortedSubmissions.sort((a, b) => new Date(a.submissionTime) - new Date(b.submissionTime));
            } else if (filterDto.SortBy === 1) { // StudentName / GroupName
                sortedSubmissions.sort((a, b) => (a.groupName || a.studentName || '').localeCompare(b.groupName || b.studentName || ''));
            }
        } else if (userRole === "Student") {
            // SortBy: 0 = Date
            if (filterDto.SortBy === 0) { // Date
                sortedSubmissions.sort((a, b) => new Date(a.submissionTime) - new Date(b.submissionTime));
            }
        }
    }

    if (filterDto.SortOrder === 1) { // Descending
        sortedSubmissions.reverse();
    }


    return {
        items: sortedSubmissions, // داده‌های مرتب شده
        totalCount: sortedSubmissions.length,
        totalPages: 1, // برای Mock، فرض می‌کنیم یک صفحه است
        currentPage: 1,
        pageSize: sortedSubmissions.length,
    };
};

export const submitGradeApi = async (exerciseSubmissionId, score) => {
    console.log(`Mock API: Instructor submitting grades for submission ${exerciseSubmissionId}:`, score);
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { success: true, message: "نمرات با موفقیت ثبت شدند. (Mock)" };
};

export const submitStudentSubmissionApi = async (exerciseId, file, description) => {
    console.log(`Mock API: Student submitting for exercise ${exerciseId}. File: ${file?.name}, Desc: ${description}`);
    await new Promise(resolve => setTimeout(resolve, 1500));
    if (file && description) {
        return { success: true, message: "پاسخ با موفقیت ارسال شد. (Mock)" };
    } else {
        return { success: false, message: "فایل یا توضیحات ناقص است. (Mock)" };
    }
};


export const downloadSubmissionFileApi = async (exerciseSubmissionId, userRole, fileName) => {
    console.log(`Mock API: Downloading submission file from submission ID: ${exerciseSubmissionId}`);
    alert(`Mock Download: Downloading ${fileName} from submission ID: ${exerciseSubmissionId}`);
    await new Promise(resolve => setTimeout(resolve, 500));
    // در Mock، نیازی به فراخوانی API نیست
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

    const apiEndpoint = `${API_BASE_URL}/api/ExerciseSubmissions/${exerciseId}`; // PUT endpoint

    const formData = new FormData();
    formData.append('scoreFile', scoreFile);

    console.log(`Uploading scores for exercise ${exerciseId}, file: ${scoreFile.name}`);
    try {
        const response = await fetch(apiEndpoint, {
            method: 'PUT',
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
            } catch (jsonError) {
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
