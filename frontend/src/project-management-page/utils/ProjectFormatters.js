const PERSIAN_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

const toPersianDigits = (str) => {
    if (str === null || str === undefined) return '';
    return String(str).replace(/\d/g, (d) => PERSIAN_DIGITS[parseInt(d)]);
};

/**
 * Formats a given Date object into Persian date and time string.
 * @param {Date} dateObj - The Date object to format.
 * @returns {string} Formatted date and time string in Persian.
 */
const formatDateTime = (dateObj) => {
    if (!(dateObj instanceof Date) || isNaN(dateObj)) return '';

    const formattedDate = dateObj.toLocaleDateString("fa-IR", {
        year: "numeric",
        month: "numeric",
        day: "numeric",
    });
    const formattedTime = dateObj.toLocaleTimeString("fa-IR", {
        hour: "2-digit",
        minute: "2-digit",
    });
    return `${formattedDate}، ${formattedTime}`;
};

/**
 * Formats raw project data from API into a display-ready object.
 * @param {object} rawProject - The raw project object from the API.
 * @returns {object} Formatted project object.
 */
export const formatProjectData = (rawProject) => {
    if (!rawProject) return null;

    const startDate = new Date(rawProject.startDate);
    const endDate = new Date(rawProject.endDate);

    const formattedStartDate = formatDateTime(startDate);
    const formattedEndDate = formatDateTime(endDate);

    const formattedDateRange = rawProject.startDate && rawProject.endDate
        ? `${formattedStartDate} - ${formattedEndDate}`
        : "تاریخ نامشخص";


    const projectType = rawProject.projectType === 0 ? "فردی" : "گروهی";

    let statusText;
    switch (rawProject.projectStatus) {
        case 0:
            statusText = "شروع نشده";
            break;
        case 1:
            statusText = "در حال انجام";
            break;
        case 2:
            statusText = "تکمیل شده";
            break;
        default:
            statusText = "وضعیت نامشخص";
    }

    return {
        ...rawProject,
        date: formattedDateRange,
        type: projectType,
        status: statusText,
        description: rawProject.description || "توضیحاتی وجود ندارد!",
    };
};