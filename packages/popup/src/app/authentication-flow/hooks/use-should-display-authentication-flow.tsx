import { DataStatus, useModuleQuery } from "@dashlane/framework-react";
import { NotAllowedReason, vaultAccessApi } from "@dashlane/session-contracts";
const TasksDonePostLogin = [
  NotAllowedReason.Requires2FAEnforcement,
  NotAllowedReason.RequiresSettingUpRecoveryKey,
];
export const useShouldDisplayAuthenticationFlow = () => {
  const isAllowed = useModuleQuery(vaultAccessApi, "isAllowed");
  if (isAllowed.status !== DataStatus.Success) {
    return {
      status: isAllowed.status,
      shouldDisplayAuthFlow: undefined,
    };
  }
  if (isAllowed.data.isAllowed) {
    return {
      status: isAllowed.status,
      shouldDisplayAuthFlow: false,
    };
  }
  const hasPreLoginTasks =
    isAllowed.data.reasons.filter((r) => !TasksDonePostLogin.includes(r))
      .length > 0;
  return {
    status: isAllowed.status,
    shouldDisplayAuthFlow: hasPreLoginTasks,
  };
};
