const formatPersianDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString("fa-IR", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
};

const formatPersianTime = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleTimeString("fa-IR", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
    });
};

export const formatExamForTable = (exam) => {
    return {
        ...exam,
        id: exam.examId,
        location: exam.examLocation || 'مشخص نشده',
        dateFormatted: formatPersianDate(exam.date),
        timeFormatted: formatPersianTime(exam.date),
    };
};