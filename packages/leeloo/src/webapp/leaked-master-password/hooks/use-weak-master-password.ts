import { DataStatus, useModuleQuery } from "@dashlane/framework-react";
import { masterPasswordSecurityApi } from "@dashlane/master-password-contracts";
export const useWeakMasterPassword = (): boolean => {
  const { data, status } = useModuleQuery(
    masterPasswordSecurityApi,
    "isMasterPasswordWeak"
  );
  if (status !== DataStatus.Success) {
    return false;
  }
  return data;
};
