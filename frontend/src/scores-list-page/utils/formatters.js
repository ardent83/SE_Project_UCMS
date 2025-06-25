const PERSIAN_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

export const toPersianDigits = (str) => {
    if (str === null || str === undefined) return '';
    return String(str).replace(/\d/g, (d) => PERSIAN_DIGITS[parseInt(d)]);
};

export const formatPersianDate = (dateInput) => {
    if (!dateInput) return '';
    const date = new Date(dateInput);
    if (isNaN(date)) return '';
    return date.toLocaleDateString('fa-IR', { year: 'numeric', month: 'long', day: 'numeric' });
};

export const formatPersianTime = (dateInput) => {
    if (!dateInput) return '';
    const date = new Date(dateInput);
    if (isNaN(date)) return '';
    return date.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' });
};

/**
 * Formats a number to Persian numerals.
 * @param {number|string} num - The number to format.
 * @returns {string} Formatted Persian number.
 */
export const formatToPersianNumber = (num) => {
    if (num === null || num === undefined || num === '') return '-';
    // Ensure it's a number before formatting to locale string
    return Number(num).toLocaleString('fa-IR');
};
