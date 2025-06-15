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
        throw error;
    }
    return await response.json();
};

export const fetchExerciseSubmissionsApi = async (exerciseId, userRole) => {
    console.log(`Mock API: Fetching submissions for exercise ${exerciseId} as ${userRole}`);
    await new Promise(resolve => setTimeout(resolve, 700));

    const mockSubmissions = [
        { id: 'sub1', groupId: 'groupA', groupName: 'گروه ستاره', submissionTime: '2025-06-20T10:00:00Z', fileType: 'pdf', grade: null, submitted: false, fileUrl: 'mock_file_a.pdf' },
        { id: 'sub2', groupId: 'groupB', groupName: 'گروه ماه', submissionTime: '2025-06-21T14:30:00Z', fileType: 'zip', grade: 18, submitted: true, fileUrl: 'mock_file_b.zip' },
        { id: 'sub3', groupId: 'groupC', groupName: 'گروه خورشید', submissionTime: '2025-06-22T09:15:00Z', fileType: 'rar', grade: null, submitted: false, fileUrl: 'mock_file_c.rar' },
    ];
    return mockSubmissions;
};

export const submitGradeApi = async (submissionId, gradesData, totalScore) => {
    console.log(`Mock API: Instructor submitting grades for submission ${submissionId}:`, gradesData, `Total Score: ${totalScore}`);
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { success: true, message: "نمرات با موفقیت ثبت شدند." };
};

export const submitStudentSubmissionApi = async (exerciseId, file, description) => {
    console.log(`Mock API: Student submitting for exercise ${exerciseId}. File: ${file?.name}, Desc: ${description}`);
    await new Promise(resolve => setTimeout(resolve, 1500));
    if (file && description) {
        return { success: true, message: "پاسخ با موفقیت ارسال شد." };
    } else {
        return { success: false, message: "فایل یا توضیحات ناقص است." };
    }
};

export const downloadSubmissionFileApi = async (submissionFileUrl, fileName = 'submission_file') => {
    console.log(`Downloading submission file from: ${submissionFileUrl}`);
    alert(`Mock Download: Downloading ${fileName} from ${submissionFileUrl}`);
    await new Promise(resolve => setTimeout(resolve, 500));
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
            throw error;
        }
        console.log(`Exercise ${exerciseId} deleted successfully from backend.`);
    } catch (err) {
        console.error("Error deleting exercise:", err);
        throw err;
    }
};
