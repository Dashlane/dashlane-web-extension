import { DataStatus, useModuleQuery } from '@dashlane/framework-react';
import { teamPlanDetailsApi } from '@dashlane/team-admin-contracts';
export const useGetTeamName = (): string | null => {
    const { data: teamName, status: teamNameStatus } = useModuleQuery(teamPlanDetailsApi, 'getTeamName');
    if (teamNameStatus !== DataStatus.Success) {
        return null;
    }
    return teamName;
};
