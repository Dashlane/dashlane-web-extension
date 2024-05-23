import { masterPasswordSecurityApi } from '@dashlane/master-password-contracts';
import { DataStatus, useModuleQuery } from '@dashlane/framework-react';
export function useIsMasterPasswordWeak(): boolean {
    const { data: isLeaked, status: isLeakedStatus } = useModuleQuery(masterPasswordSecurityApi, 'isMasterPasswordWeak');
    const { data: isDismissed, status: isDismissedStatus } = useModuleQuery(masterPasswordSecurityApi, 'isMasterPasswordNotificationDismissed');
    if (isLeakedStatus !== DataStatus.Success ||
        isDismissedStatus !== DataStatus.Success) {
        return false;
    }
    return isLeaked && !isDismissed;
}
