import { accountRecoveryKeyApi } from '@dashlane/account-recovery-contracts';
import { useModuleQuery } from '@dashlane/framework-react';
export const useIsRecoveryKeyEnabled = (loginEmail: string) => {
    const accountRecoveryStatus = useModuleQuery(accountRecoveryKeyApi, 'accountRecoveryKeyStatus', { login: loginEmail }, [loginEmail]);
    return accountRecoveryStatus.data?.isEnabled;
};
