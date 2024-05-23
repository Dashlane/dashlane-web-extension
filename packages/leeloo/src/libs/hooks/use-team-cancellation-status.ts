import { DataStatus, useModuleQuery } from '@dashlane/framework-react';
import { CancellationStatus, teamPlanDetailsApi, } from '@dashlane/team-admin-contracts';
export const useTeamCancellationStatus = (): CancellationStatus | null => {
    const teamCancellationStatus = useModuleQuery(teamPlanDetailsApi, 'getTeamCancellationStatus');
    return teamCancellationStatus.status === DataStatus.Success
        ? teamCancellationStatus.data
        : null;
};
