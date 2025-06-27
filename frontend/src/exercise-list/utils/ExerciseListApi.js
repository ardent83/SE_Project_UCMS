const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const convertStatus = (statusCode) => {
    switch (statusCode) {
        case 0:
            return "شروع نشده";
        case 1:
            return "در حال انجام";
        case 2:
            return "تکمیل";
        default:
            return "نامشخص";
    }
};

export const fetchExercisesForInstructor = async () => {
    try {
        const response = await fetch(`${apiBaseUrl}/api/Exercises/instructor`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        });

        if (!response.ok) {
            throw new Error(`خطا در دریافت تکالیف - وضعیت: ${response.status}`);
        }

        const data = await response.json();

        return data.map((item) => ({
            exerciseId: item.exerciseId,
            title: item.title,
            classTitle: item.classTitle,
            endDate: item.endDate,
            status: convertStatus(item.status),
        }));
    } catch (error) {
        console.error("خطا در دریافت تکالیف:", error);
        return [];
    }
};


export const fetchExercisesForStudent = async () => {
    try {
        const response = await fetch(`${apiBaseUrl}/api/Exercises/Student`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        });

        if (!response.ok) {
            throw new Error(`خطا در دریافت تکالیف - وضعیت: ${response.status}`);
        }

        const data = await response.json();

        return data.map((item) => ({
            exerciseId: item.exerciseId,
            title: item.title,
            classTitle: item.classTitle,
            endDate: item.endDate,
            status: convertStatus(item.status),
        }));
    } catch (error) {
        console.error("خطا در دریافت تکالیف:", error);
        return [];
    }
};
