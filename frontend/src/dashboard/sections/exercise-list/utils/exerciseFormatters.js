const PERSIAN_STATUS_TEXT = {
  2: "نمره‌دهی شده",
  1: "تحویل داده شده",
  0: "انجام نشده",
};

const STATUS_STYLES = {
  2: "bg-purple-200 text-purple-800",
  1: "bg-green-200 text-green-800",
  0: "bg-orange-200 text-orange-700",
};

const STATUS_BORDER_STYLES = {
  2: "border border-purple-500",
  1: "border border-green-500",
  0: "border border-orange-500",
};

const STATUS_BORDER_COLORS = {
    2: '#8b5cf6',
    1: '#22c55e',
    0: '#f97316',
};

const STATUS_PERCENTAGES = {
    2: 0.5,
    1: 1,
    0: 0,
};

const formatPersianDate = (dateString) => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("fa-IR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const formatExerciseForCard = (exercise) => {
  return {
    id: exercise.exerciseId,
    title: exercise.title,
    classTitle: exercise.classTitle,
    endDateFormatted: formatPersianDate(exercise.endDate),
    status: exercise.status,
    statusText: PERSIAN_STATUS_TEXT[exercise.status] || "نامشخص",
    statusStyle: STATUS_STYLES[exercise.status] || "bg-gray-200 text-gray-800",
    statusBorderStyle: STATUS_BORDER_STYLES[exercise.status] || "border-r-4 border-r-gray-500",
    statusBorderColor: STATUS_BORDER_COLORS[exercise.status] || '#f97316',
    percentage: STATUS_PERCENTAGES[exercise.status] || 0,
  };
};
