import { DataStatus, useModuleQuery } from "@dashlane/framework-react";
import { masterPasswordSecurityApi } from "@dashlane/master-password-contracts";
export const useLeakedMasterPassword = (): boolean => {
  const { data, status } = useModuleQuery(
    masterPasswordSecurityApi,
    "isMasterPasswordLeaked"
  );
  if (status !== DataStatus.Success) {
    return false;
  }
  return data;
};
