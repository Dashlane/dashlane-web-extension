import { useModuleQuery } from "@dashlane/framework-react";
import { sharingItemsApi } from "@dashlane/sharing-contracts";
export const useSharedAccessData = (itemId: string) => {
  return useModuleQuery(sharingItemsApi, "sharedAccessForItem", {
    itemId,
  });
};
