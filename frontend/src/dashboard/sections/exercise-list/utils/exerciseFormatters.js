const ExerciseStatus = {
    NotStarted: 0,
    InProgress: 1,
    Completed: 2
}

const PERSIAN_STATUS_TEXT = {
  [ExerciseStatus.Completed]: "تکمیل شده",
  [ExerciseStatus.InProgress]: "در حال انجام",
  [ExerciseStatus.NotStarted]: "شروع نشده",
};

const STATUS_STYLES = {
  [ExerciseStatus.Completed]: "bg-green-200 text-green-800",
  [ExerciseStatus.InProgress]: "bg-purple-200 text-purple-800",
  [ExerciseStatus.NotStarted]: "bg-orange-200 text-orange-700",
};

const STATUS_BORDER_STYLES = {
  [ExerciseStatus.Completed]: "border border-green-500",
  [ExerciseStatus.InProgress]: "border border-purple-500",
  [ExerciseStatus.NotStarted]: "border border-orange-500",
};

const STATUS_BORDER_COLORS = {
    [ExerciseStatus.Completed]: '#22c55e',
    [ExerciseStatus.InProgress]: '#8b5cf6',
    [ExerciseStatus.NotStarted]: '#f97316',
};

const STATUS_PERCENTAGES = {
    [ExerciseStatus.Completed]: 1,
    [ExerciseStatus.InProgress]: 0.5,
    [ExerciseStatus.NotStarted]: 0,
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
