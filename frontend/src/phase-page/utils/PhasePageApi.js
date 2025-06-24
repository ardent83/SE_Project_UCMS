const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;


export const getPhaseInformationForInstructor = async (phaseId) => {
    try {
        const res = await fetch(`${apiBaseUrl}/api/Phase/Instructor/${phaseId}`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
            },
        });

        if (!res.ok) throw new Error('Error in catching phase info');

        return await res.json();
    } catch (error) {
        console.error('Error:', error.message);
        throw error;
    }
};

export const getPhaseInformationForStudent = async (phaseId) => {
    try {
        const res = await fetch(`${apiBaseUrl}/api/Phase/Student/${phaseId}`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
            },
        });

        if (!res.ok) throw new Error('Error in catching phase info');

        return await res.json();
    } catch (error) {
        console.error('Error:', error.message);
        throw error;
    }
};

export const downloadFileForStudent = async (phaseId) => {
    const response = await fetch(`${apiBaseUrl}/api/Phase/${phaseId}/downloadForStudent`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
    });

    if (!response.ok) throw new Error("دانلود برای دانشجو ناموفق بود");

    const blob = await response.blob();
    const contentDisposition = response.headers.get("Content-Disposition");
    const filename = contentDisposition?.split("filename=")[1]?.split(";")[0]?.replace(/"/g, "") || "student-file.pdf";

    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = filename;
    link.click();
};

export const downloadFileForInstructor = async (phaseId) => {
    const response = await fetch(`${apiBaseUrl}/api/Phase/${phaseId}/downloadForInstructor`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
    });

    if (!response.ok) throw new Error("دانلود برای استاد ناموفق بود");

    const blob = await response.blob();
    const contentDisposition = response.headers.get("Content-Disposition");
    const filename = contentDisposition?.split("filename=")[1]?.split(";")[0]?.replace(/"/g, "") || "instructor-file.pdf";

    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = filename;
    link.click();
};
