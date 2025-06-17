const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Fetches a list of classes based on user role, filters, search, and pagination.
 * @param {object} params - Object containing query parameters (searchQuery, selectedFilter, page, pageSize).
 * @param {string} userRole - The role of the current user ('Instructor' or 'Student').
 * @returns {Promise<object>} An object containing class items, total pages, etc.
 */
export const fetchClassesApi = async (params, userRole) => {
    let apiEndpoint;
    const queryParams = new URLSearchParams({
        ...(params.searchQuery && { Title: params.searchQuery }),
        ...(userRole === "Student" && params.searchQuery && { InstructorName: params.searchQuery }),
        ...(params.selectedFilter !== "همه" && userRole === "Instructor" && {
            isActive: params.selectedFilter === "فعال" ? "true" : "false",
        }),
        ...(userRole === "Student" && params.selectedFilter === "کلاس‌های من" && {
            myClasses: "true",
        }),
        ...(userRole === "Student" && params.selectedFilter === "کلاس‌های دیگر" && {
            otherClasses: "true",
        }),
        Page: params.page,
        PageSize: params.pageSize,
    }).toString();

    if (userRole === "Instructor") {
        apiEndpoint = `${API_BASE_URL}/api/Classes/instructor?${queryParams}`;
    } else if (userRole === "Student") {
        apiEndpoint = `${API_BASE_URL}/api/studentclass/student/classes?${queryParams}`;
    } else {
        throw new Error("نقش کاربر پشتیبانی نمی‌شود!");
    }

    console.log("Fetching classes from:", apiEndpoint);
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
 * Submits data to join a class.
 * @param {object} formData - Object containing classCode and password.
 * @returns {Promise<object>} API response result.
 */
export const joinClassApi = async (formData) => {
    const requestBody = {
        ClassCode: formData.ClassCode,
        Password: formData.Password,   
    };

    const response = await fetch(`${API_BASE_URL}/api/StudentClass/join`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
        const error = new Error(`HTTP error! Status: ${response.status}`);
        error.status = response.status;
        throw error;
    }
    return await response.json();
};