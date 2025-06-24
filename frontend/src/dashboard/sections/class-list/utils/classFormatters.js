const DAYS_IN_PERSIAN = ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه'];
const PERSIAN_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
const CARD_COLORS = ["var(--color-light-lavender)", "var(--color-pale-yellow)", "var(--color-sky-blue)", "var(--color-light-green)"];

const toPersianDigits = (str) => {
    if (str === null || str === undefined) return '';
    return String(str).replace(/\d/g, (d) => PERSIAN_DIGITS[parseInt(d)]);
};

const formatTime = (time) => {
    if (!time) return '';
    const [h, m] = time.split(':');
    return `${toPersianDigits(h)}:${toPersianDigits(m)}`;
};

const getColorByIndex = (index) => {
    return CARD_COLORS[index % CARD_COLORS.length];
};


export const formatClassForCard = (detail, index, isInstructor, userFullName) => {
    const sortedSchedules = (detail.schedules || []).sort((a, b) => a.dayOfWeek - b.dayOfWeek);

    const days = sortedSchedules
        .map((s) => DAYS_IN_PERSIAN[s.dayOfWeek % 7])
        .join(' و ');

    const times = sortedSchedules
        .map((s) => `${formatTime(s.startTime)}-${formatTime(s.endTime)}`)
        .reverse()
        .join('، ');

    return {
        id: detail.id,
        title: detail.title,
        instructor: isInstructor ? userFullName : detail.instructorFullName || 'نامشخص',
        days: days,
        times: times,
        color: getColorByIndex(index),
    };
};