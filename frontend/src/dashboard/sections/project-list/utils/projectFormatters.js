const STATUS_STYLES = {
    2: "bg-green-200 text-green-800",
    1: "bg-sky-200 text-sky-700",
    0: "bg-orange-200 text-orange-700",
};

const PERSIAN_STATUS_TEXT = {
    2: "تحویل شده",
    1: "در حال انجام",
    0: "انجام نشده",
};

const formatPersianDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fa-IR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
};

const formatPersianTime = (timeString) => {
    if (!timeString) return '';
    const [h, m] = timeString.split(':');
    const timeUTC = new Date(Date.UTC(2020, 0, 1, h, m));
    return timeUTC.toLocaleTimeString('fa-IR', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });
};

export const formatProjectForTable = (project) => {
    return {
        ...project,
        dueDateFormatted: formatPersianDate(project.dueDate),
        dueTimeFormatted: formatPersianTime(project.dueTime),
        statusText: PERSIAN_STATUS_TEXT[project.status] || 'نامشخص',
        statusStyle: STATUS_STYLES[project.status] || "bg-gray-200 text-gray-800",
    };
};