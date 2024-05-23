import { DataStatus, useModuleQuery } from '@dashlane/framework-react';
import { teamGetStartedApi, TeamTasks } from '@dashlane/team-admin-contracts';
export interface UseTeamTasksCompletion extends TeamTasks {
    status: DataStatus;
}
export const useTeamTasksCompletion = (): UseTeamTasksCompletion => {
    const { data, status } = useModuleQuery(teamGetStartedApi, 'teamTasksCompletion');
    if (status !== DataStatus.Success) {
        return {
            status,
            hasMinimumMemberCount: false,
            hasMoreThanOneAdmin: false,
            hasSecurityScore: false,
            hasOnlyOneMember: false,
            isSharingDisabled: false,
        };
    }
    return {
        status,
        ...data,
    };
};
