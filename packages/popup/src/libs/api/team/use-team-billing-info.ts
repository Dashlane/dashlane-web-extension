import { DataStatus, useModuleQueries, useModuleQuery, } from '@dashlane/framework-react';
import { GetTeamBillingInformationResult, teamPlanDetailsApi, } from '@dashlane/team-admin-contracts';
export type UseTeamBillingInfoOutput = {
    isLoading: true;
} | {
    isLoading: false;
    teamBilling: GetTeamBillingInformationResult | null;
};
export function useTeamBillingInfo(): UseTeamBillingInfoOutput {
    const teamBillingInformation = useModuleQuery(teamPlanDetailsApi, 'getTeamBillingInformation');
    if (teamBillingInformation.status === DataStatus.Loading) {
        return {
            isLoading: true,
        };
    }
    if (teamBillingInformation.status === DataStatus.Error) {
        return { isLoading: false, teamBilling: null };
    }
    return { isLoading: false, teamBilling: teamBillingInformation.data };
}
