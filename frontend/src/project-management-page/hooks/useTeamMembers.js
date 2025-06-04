import { useState, useCallback } from 'react';
import { fetchTeamMembersApi } from '../utils/TeamAPI.js';
import { formatTeamMembersArrayForDisplay } from '../utils/TeamFormatters.js';

export const useTeamMembers = (teamId, userRole) => {
    const [members, setMembers] = useState([]);
    const [loadingMembers, setLoadingMembers] = useState(false);
    const [membersError, setMembersError] = useState(null);

    const loadMembers = useCallback(async () => {
        if (!teamId) {
            setMembersError("شناسه تیم برای بارگذاری اعضا نامعتبر است.");
            return;
        }

        setLoadingMembers(true);
        setMembersError(null);
        try {
            const rawMembers = await fetchTeamMembersApi(teamId, userRole);
            const formattedMembers = formatTeamMembersArrayForDisplay(rawMembers, userRole);
            setMembers(formattedMembers);
        } catch (err) {
            console.error(`Error loading members for team ${teamId}:`, err);
            setMembersError(err.message || "خطا در بارگذاری اعضا.");
        } finally {
            setLoadingMembers(false);
        }
    }, [teamId, userRole]);

    return { members, loadingMembers, membersError, loadMembers };
};