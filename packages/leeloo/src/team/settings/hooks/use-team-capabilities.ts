import { DataStatus, useModuleQuery } from '@dashlane/framework-react';
import { Capabilities, teamPlanDetailsApi, } from '@dashlane/team-admin-contracts';
export const useTeamCapabilities = (): Capabilities | null => {
    const teamCapabilities = useModuleQuery(teamPlanDetailsApi, 'getTeamCapabilities');
    return teamCapabilities.status === DataStatus.Success
        ? teamCapabilities.data
        : null;
};
