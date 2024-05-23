import { DataStatus, useModuleQuery } from '@dashlane/framework-react';
import { teamPlanDetailsApi } from '@dashlane/team-admin-contracts';
export type UseGetTeamCreationDate = {
    status: DataStatus.Loading | DataStatus.Error;
} | {
    status: DataStatus.Success;
    teamCreationDate: number;
};
export const useTeamCreationDate = (): UseGetTeamCreationDate => {
    const { data, status } = useModuleQuery(teamPlanDetailsApi, 'getTeamCreationDateUnix');
    if (status !== DataStatus.Success) {
        return { status };
    }
    return { status, teamCreationDate: data };
};
