import { DataStatus, useModuleQuery } from "@dashlane/framework-react";
import { NotAllowedReason, vaultAccessApi } from "@dashlane/session-contracts";
export const useShouldChangeLoginEmail = () => {
  const query = useModuleQuery(vaultAccessApi, "isAllowed");
  if (query.status !== DataStatus.Success) {
    return false;
  }
  return (
    !query.data.isAllowed &&
    query.data.reasons.includes(NotAllowedReason.RequiresChangeLoginEmail)
  );
};
