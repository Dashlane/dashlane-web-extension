import { DataStatus, useModuleQuery } from '@dashlane/framework-react';
import { GetTeamBillingInformationResult, teamPlanDetailsApi, } from '@dashlane/team-admin-contracts';
export const useTeamBillingInformation = (): GetTeamBillingInformationResult | null => {
    const teamBillingInformation = useModuleQuery(teamPlanDetailsApi, 'getTeamBillingInformation');
    return teamBillingInformation.status === DataStatus.Success
        ? teamBillingInformation.data
        : null;
};
