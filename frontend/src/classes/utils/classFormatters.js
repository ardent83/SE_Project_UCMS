const PERSIAN_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

export const toPersianDigits = (str) => {
    if (str === null || str === undefined) return '';
    return String(str).replace(/\d/g, (d) => PERSIAN_DIGITS[parseInt(d)]);
};

/**
 * Formats class data from API for ProductCard.
 * Add any specific formatting here if needed.
 * @param {object} classItem - Raw class item from API.
 * @param {string} apiBaseUrl - Base URL for image paths.
 * @returns {object} Formatted class data for ProductCard.
 */
export const formatClassForProductCard = (classItem, apiBaseUrl) => {
    if (!classItem) return null;

    const imageUrl = classItem.profileImageUrl
        ? `${apiBaseUrl}${classItem.profileImageUrl.startsWith('/') ? '' : '/'}${classItem.profileImageUrl}`
        : "./assets/download.png"; 

    return {
        id: classItem.id,
        title: classItem.title,
        studentCount: classItem.studentCount,
        instructorName: classItem.instructorFullName || "نام استاد نامشخص",
        imageUrl: imageUrl,
    };
};

/**
 * Formats a number to Persian digits for pagination.
 * @param {number} number - The number to format.
 * @returns {string} Formatted number in Persian.
 */
export const formatNumberToPersian = (number) => {
    return Number(number).toLocaleString("fa-IR");
};