import { DataStatus, useModuleQuery } from "@dashlane/framework-react";
import { vaultAccessApi } from "@dashlane/session-contracts";
export const useIsAllowed = () => {
  const isAllowed = useModuleQuery(vaultAccessApi, "isAllowed");
  return {
    status: isAllowed.status,
    data: isAllowed.status === DataStatus.Success && isAllowed.data.isAllowed,
  };
};
