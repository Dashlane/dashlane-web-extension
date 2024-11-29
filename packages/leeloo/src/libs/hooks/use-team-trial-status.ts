import { DataStatus, useModuleQuery } from "@dashlane/framework-react";
import {
  GetTeamTrialStatusResult,
  teamPlanDetailsApi,
} from "@dashlane/team-admin-contracts";
export const useTeamTrialStatus = (): GetTeamTrialStatusResult | null => {
  const teamTrialStatus = useModuleQuery(
    teamPlanDetailsApi,
    "getTeamTrialStatus"
  );
  return teamTrialStatus.status === DataStatus.Success
    ? teamTrialStatus.data
    : null;
};
