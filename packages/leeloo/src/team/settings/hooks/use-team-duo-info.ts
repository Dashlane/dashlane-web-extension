import { useModuleQuery } from "@dashlane/framework-react";
import { teamPlanDetailsApi } from "@dashlane/team-admin-contracts";
export const useTeamDuoInfo = () => {
  const getTeamDuoInfo = useModuleQuery(teamPlanDetailsApi, "getTeamDuoInfo");
  return {
    status: getTeamDuoInfo.status,
    data: getTeamDuoInfo.data,
    error: getTeamDuoInfo.error,
  };
};
