const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

export const updatePrivateSettings = async (roleId, privateData) => {
    let endpoint;
    let payload;

    if (roleId === 2) {
        endpoint = `${apiBaseUrl}/api/students/profile/edit`;
        payload = {
            studentNumber: privateData.studentNumber,
            major: privateData.major,
            enrollmentYear: privateData.enrollmentYear,
            university: Number(privateData.university),
            educationLevel: Number(privateData.educationLevel)
        };
    } else if (roleId === 1) {
        endpoint = `${apiBaseUrl}/api/instructors/profile/edit`;
        payload = {
            employeeCode: privateData.employeeCode,
            department: privateData.department,
            university: Number(privateData.university),
            rank: Number(privateData.rank)
        };
    } else {
        throw new Error(" user role for private settings update.");
    }
    const response = await fetch(endpoint, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(payload),
    });
    return response;
};
