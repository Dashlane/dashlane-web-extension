import { useModuleQuery } from "@dashlane/framework-react";
import { sharingItemsApi } from "@dashlane/sharing-contracts";
export const useShareItemsErrors = () => {
  return useModuleQuery(sharingItemsApi, "shareItemsErrors");
};
