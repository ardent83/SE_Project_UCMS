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

const toPersianDigits = (str) => {
    return str.replace(/\d/g, (digit) => "۰۱۲۳۴۵۶۷۸۹"[Number(digit)]);
};

export const fetchProjects = async () => {
    try {
        const response = await fetch(`${apiBaseUrl}/api/Project/instructor`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        });

        if (!response.ok) {
            throw new Error(`خطا در دریافت پروژه‌ها - وضعیت: ${response.status}`);
        }

        const data = await response.json();

        return data.map((item) => ({
            id: item.id,
            name: item.title,
            lesson: item.classTitle,
            time: toPersianDigits(item.dueTime?.slice(0, 5)),
            deliveryDate: new Date(item.dueDate).toLocaleDateString("fa-IR"),
            status: convertStatus(item.status),
        }));
    } catch (error) {
        console.error(" خطا در دریافت پروژه‌ها:", error);
        return [];
    }
};
