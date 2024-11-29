import { DataStatus } from "@dashlane/carbon-api-consumers";
import { useModuleQuery } from "@dashlane/framework-react";
import { sharingItemsApi } from "@dashlane/sharing-contracts";
export const useIsAllowedToShare = (): boolean => {
  const { data, status } = useModuleQuery(sharingItemsApi, "isSharingAllowed");
  return status === DataStatus.Success ? data : false;
};
