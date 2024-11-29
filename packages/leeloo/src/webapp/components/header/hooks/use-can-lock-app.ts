import { authenticationApi } from "@dashlane/authentication-contracts";
import { DataStatus, useModuleQuery } from "@dashlane/framework-react";
export const useCanLockApp = () => {
  const canLockApp = useModuleQuery(authenticationApi, "canLockApp");
  return canLockApp.status === DataStatus.Success && canLockApp.data;
};
