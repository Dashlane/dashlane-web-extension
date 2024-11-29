import { accountRecoveryKeyApi } from "@dashlane/account-recovery-contracts";
import { pinCodeApi } from "@dashlane/authentication-contracts";
import { DataStatus, useModuleQuery } from "@dashlane/framework-react";
import { useUserLogin } from "../../../hooks/use-user-login";
export enum ChangeMpConsequence {
  LogOut = "LogOut",
  DisableArk = "DisableArk",
  DisablePin = "DisablePin",
}
type HookResult =
  | {
      loaded: true;
      consequences: ChangeMpConsequence[];
    }
  | {
      loaded: false;
      consequences: never[];
    };
export const useChangeMpConsequences = (): HookResult => {
  const login = useUserLogin();
  const hasPinQuery = useModuleQuery(pinCodeApi, "getCurrentUserStatus");
  const hasArkQuery = useModuleQuery(
    accountRecoveryKeyApi,
    "accountRecoveryKeyStatus",
    { login: login ?? "" }
  );
  if (
    !login ||
    hasPinQuery.status !== DataStatus.Success ||
    hasArkQuery.status !== DataStatus.Success
  ) {
    return { loaded: false, consequences: [] };
  }
  return {
    loaded: true,
    consequences: [
      ChangeMpConsequence.LogOut,
      ...(hasArkQuery.data.isEnabled ? [ChangeMpConsequence.DisableArk] : []),
      ...(hasPinQuery.data.isPinCodeEnabled
        ? [ChangeMpConsequence.DisablePin]
        : []),
    ],
  };
};
