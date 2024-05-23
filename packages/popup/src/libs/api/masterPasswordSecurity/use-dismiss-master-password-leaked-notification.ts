import { masterPasswordSecurityApi } from '@dashlane/master-password-contracts';
import { useModuleCommands } from '@dashlane/framework-react';
export function useDismissMasterPasswordNotification(): () => void {
    const { dismissMasterPasswordNotification } = useModuleCommands(masterPasswordSecurityApi);
    return () => {
        void dismissMasterPasswordNotification(undefined);
    };
}
