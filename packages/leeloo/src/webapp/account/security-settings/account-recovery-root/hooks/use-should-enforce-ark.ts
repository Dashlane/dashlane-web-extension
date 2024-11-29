import { DataStatus, useModuleQuery } from "@dashlane/framework-react";
import { NotAllowedReason, vaultAccessApi } from "@dashlane/session-contracts";
export const useShouldEnforceArk = () => {
  const query = useModuleQuery(vaultAccessApi, "isAllowed");
  if (query.status !== DataStatus.Success) {
    return {
      shouldEnforce: false,
    };
  }
  return {
    shouldEnforce:
      !query.data.isAllowed &&
      query.data.reasons.includes(
        NotAllowedReason.RequiresSettingUpRecoveryKey
      ),
  };
};
