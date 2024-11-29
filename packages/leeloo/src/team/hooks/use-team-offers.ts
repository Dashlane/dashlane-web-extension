import { DataStatus, useModuleQuery } from "@dashlane/framework-react";
import { B2BOffers, teamPlanUpdateApi } from "@dashlane/team-admin-contracts";
export const useTeamOffers = (): B2BOffers | null => {
  const { data, status } = useModuleQuery(
    teamPlanUpdateApi,
    "getTeamOffers",
    {}
  );
  if (status !== DataStatus.Success) {
    return null;
  }
  return data;
};
