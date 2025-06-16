// src/features/ExercisePage/utils/exerciseFormatters.js

const PERSIAN_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

export const toPersianDigits = (str) => {
    if (str === null || str === undefined) return '';
    return String(str).replace(/\d/g, (d) => PERSIAN_DIGITS[parseInt(d)]);
};

/**
 * Formats a Date object into a Persian date string (e.g., "۲۰ اردیبهشت ۱۴۰۴").
 * @param {string|Date} dateInput - The date string or Date object.
 * @returns {string} Formatted Persian date.
 */
export const formatPersianDate = (dateInput) => {
    if (!dateInput) return '';
    const date = new Date(dateInput);
    if (isNaN(date)) return '';
    return date.toLocaleDateString('fa-IR', { year: 'numeric', month: 'long', day: 'numeric' });
};

/**
 * Formats a Date object into a Persian time string (e.g., "۱۸:۰۰").
 * @param {string|Date} dateInput - The date string or Date object.
 * @returns {string} Formatted Persian time.
 */
export const formatPersianTime = (dateInput) => {
    if (!dateInput) return '';
    const date = new Date(dateInput);
    if (isNaN(date)) return '';
    return date.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' });
};

/**
 * Formats exercise data for display.
 * @param {object} exercise - Raw exercise object from API.
 * @returns {object} Formatted exercise data.
 */
export const formatExerciseData = (exercise) => {
    if (!exercise) return null;
    const startDate = new Date(exercise.startDate);
    const endDate = new Date(exercise.endDate);

    return {
        ...exercise,
        id: exercise.exerciseId,
        formattedStartDate: formatPersianDate(startDate),
        formattedStartTime: formatPersianTime(startDate),
        formattedEndDate: formatPersianDate(endDate),
        formattedEndTime: formatPersianTime(endDate),
    };
};

/**
 * Formats a submission object for table display.
 * @param {object} submission - Raw submission object from API.
 * @returns {object} Formatted submission data.
 */
export const formatSubmissionData = (submission) => {
    if (!submission) return null;
    const submissionDateTime = new Date(submission.submissionTime);
    return {
        ...submission,
        formattedSubmissionTime: `${formatPersianDate(submissionDateTime)} – ساعت ${formatPersianTime(submissionDateTime)}`,
    };
};
