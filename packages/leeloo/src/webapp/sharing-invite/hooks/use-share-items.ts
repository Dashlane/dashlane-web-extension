import { useModuleCommands } from "@dashlane/framework-react";
import { sharingItemsApi } from "@dashlane/sharing-contracts";
export const useShareItems = () => {
  return useModuleCommands(sharingItemsApi);
};
