import { useCallback, useEffect, useState } from 'react';
import { TeamMemberInfo } from '@dashlane/communication';
import { getTeamMembers } from 'libs/carbon/triggers';
export interface UseTeamMembers {
    teamMembersLoading: boolean;
    teamMembersError: Error | null;
    teamMembers: TeamMemberInfo[];
    refreshTeamMembers: () => void;
}
export const useTeamMembers = (teamId: number | null): UseTeamMembers => {
    const [teamMembersLoading, setTeamMembersLoading] = useState(false);
    const [teamMembers, setTeamMembers] = useState<TeamMemberInfo[]>([]);
    const [teamMembersError, setTeamMembersError] = useState<Error | null>(null);
    const loadTeamMembers = useCallback(async (abortController?: AbortController) => {
        if (abortController?.signal?.aborted) {
            return;
        }
        if (teamId === null) {
            setTeamMembersError(new Error('No team id provided'));
            return;
        }
        setTeamMembersLoading(true);
        try {
            const members = await getTeamMembers({ teamId: teamId });
            setTeamMembers(members);
        }
        catch (error) {
            const augmentedError = new Error(`useTeamMember: ${error}`);
            setTeamMembersError(augmentedError);
        }
        finally {
            setTeamMembersLoading(false);
        }
    }, [teamId]);
    useEffect(() => {
        const abortController = new AbortController();
        loadTeamMembers();
        return () => {
            abortController.abort();
        };
    }, [loadTeamMembers]);
    return {
        teamMembersLoading,
        teamMembersError,
        teamMembers,
        refreshTeamMembers: loadTeamMembers,
    };
};
