import { DataStatus, useModuleQuery } from "@dashlane/framework-react";
import { Policies, teamPlanDetailsApi } from "@dashlane/team-admin-contracts";
export const useTeamPolicies = (): Policies | null => {
  const teamPolicies = useModuleQuery(teamPlanDetailsApi, "getTeamPolicies");
  return teamPolicies.status === DataStatus.Success ? teamPolicies.data : null;
};
