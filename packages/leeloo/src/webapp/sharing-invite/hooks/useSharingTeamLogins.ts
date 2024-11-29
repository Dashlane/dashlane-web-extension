import { sharingItemsApi } from "@dashlane/sharing-contracts";
import { DataStatus, useModuleQuery } from "@dashlane/framework-react";
export const useSharingTeamLogins = () => {
  return useModuleQuery(sharingItemsApi, "getSharingTeamLogins");
};
export const useSharingTeamLoginsData = () => {
  const result = useSharingTeamLogins();
  return result.status === DataStatus.Success ? result.data.userLogins : [];
};
