/**
 * Formats a single team member object for display.
 * @param {object} member - The raw member object from the API.
 * @param {string} userRole - The role of the current user ('Instructor' or 'Student').
 * @returns {object} Formatted member object with a display name.
 */
export const formatTeamMemberForDisplay = (member, userRole) => {
    if (!member) return null;

    let displayName = '';
    if (userRole === "Instructor") {
        const fullNamePart = member.fullName && member.fullName.trim() !== '' ? member.fullName.trim() : '';
        const studentNumberPart = member.studentNumber ? ` (${member.studentNumber})` : '';
        displayName = `${fullNamePart}${studentNumberPart}`.trim();
    } else {
        displayName = member.fullName || member.studentNumber || '';
    }

    return {
        ...member, 
        displayName: displayName || 'نامشخص',
    };
};

/**
 * Formats an array of team member objects for display.
 * @param {Array<object>} membersArray 
 * @param {string} userRole 
 * @returns {Array<object>}
 */
export const formatTeamMembersArrayForDisplay = (membersArray, userRole) => {
    if (!Array.isArray(membersArray)) return [];
    return membersArray.map(member => formatTeamMemberForDisplay(member, userRole));
};