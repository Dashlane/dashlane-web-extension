import { DataStatus, useModuleQuery } from "@dashlane/framework-react";
import { vaultItemsCrudApi } from "@dashlane/vault-contracts";
export const useAreRichIconsEnabled = () => {
  const result = useModuleQuery(vaultItemsCrudApi, "richIconsEnabled");
  return result.status === DataStatus.Success ? result.data : false;
};
