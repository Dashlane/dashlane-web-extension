import { accountRecoveryKeyApi } from "@dashlane/account-recovery-contracts";
import { useModuleQuery } from "@dashlane/framework-react";
import { useUserLogin } from "../../../../libs/hooks/useUserLogin";
export function useIsRecoveryKeyEnabled(): boolean {
  const userLogin = useUserLogin();
  const { data } = useModuleQuery(
    accountRecoveryKeyApi,
    "accountRecoveryKeyStatus",
    { login: userLogin ?? "" }
  );
  return data?.isEnabled ?? false;
}
