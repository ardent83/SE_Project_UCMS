const ProjectStatus = {
    NotStarted: 0,
    InProgress: 1,
    Completed: 2
}

const PERSIAN_STATUS_TEXT = {
    [ProjectStatus.Completed]: "تکمیل شده",
    [ProjectStatus.InProgress]: "در حال انجام",
    [ProjectStatus.NotStarted]: "شروع نشده",
};

const STATUS_STYLES = {
    [ProjectStatus.Completed]: "bg-green-200 text-green-800",
    [ProjectStatus.InProgress]: "bg-sky-200 text-sky-700",
    [ProjectStatus.NotStarted]: "bg-orange-200 text-orange-700",
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