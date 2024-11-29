import { DataStatus, useModuleQuery } from "@dashlane/framework-react";
import { NotAllowedReason, vaultAccessApi } from "@dashlane/session-contracts";
export const useShouldEnforceTwoFactorAuthentication = () => {
  const isAllowed = useModuleQuery(vaultAccessApi, "isAllowed");
  return {
    status: isAllowed.status,
    data:
      isAllowed.status === DataStatus.Success &&
      !isAllowed.data.isAllowed &&
      isAllowed.data.reasons.includes(NotAllowedReason.Requires2FAEnforcement),
  };
};
