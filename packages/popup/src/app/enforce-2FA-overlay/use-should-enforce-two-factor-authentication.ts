import { DataStatus, useModuleQuery } from "@dashlane/framework-react";
import { NotAllowedReason, vaultAccessApi } from "@dashlane/session-contracts";
export const useShouldEnforceTwoFactorAuthentication = () => {
  const isAllowed = useModuleQuery(vaultAccessApi, "isAllowed");
  return (
    isAllowed.status === DataStatus.Success &&
    !isAllowed.data.isAllowed &&
    isAllowed.data.reasons.includes(NotAllowedReason.Requires2FAEnforcement)
  );
};
