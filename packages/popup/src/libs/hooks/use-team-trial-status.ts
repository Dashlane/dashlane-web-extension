import { DataStatus, useModuleQuery } from "@dashlane/framework-react";
import { teamPlanDetailsApi } from "@dashlane/team-admin-contracts";
export const useTeamTrialStatus = () => {
  const teamTrialStatus = useModuleQuery(
    teamPlanDetailsApi,
    "getTeamTrialStatus"
  );
  return teamTrialStatus.status === DataStatus.Success
    ? teamTrialStatus.data
    : null;
};
