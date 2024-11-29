import { sharingItemsApi } from "@dashlane/sharing-contracts";
import { DataStatus, useModuleQuery } from "@dashlane/framework-react";
export const useIsSharingEnabled = () => {
  return useModuleQuery(sharingItemsApi, "sharingEnabled");
};
export const useIsSharingEnabledData = () => {
  const result = useIsSharingEnabled();
  return result.status === DataStatus.Success ? result.data : false;
};
