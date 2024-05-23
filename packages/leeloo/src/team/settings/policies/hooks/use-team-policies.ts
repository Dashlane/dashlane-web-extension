import { useModuleQuery } from '@dashlane/framework-react';
import { teamPlanDetailsApi } from '@dashlane/team-admin-contracts';
export const useTeamPolicies = () => {
    return useModuleQuery(teamPlanDetailsApi, 'getTeamPolicies');
};
