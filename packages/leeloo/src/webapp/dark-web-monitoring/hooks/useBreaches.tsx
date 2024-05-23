import { breachesApi } from '@dashlane/password-security-contracts';
import { useModuleCommands } from '@dashlane/framework-react';
import { logUserDismissSecurityAlert, logUserReceiveSecurityAlert, } from '../private-breaches/logs';
export interface UseBreaches {
    dismissBreach: (id: string) => Promise<unknown>;
    markBreachAsSeen: (id: string) => Promise<unknown>;
}
export const useBreaches = (): UseBreaches => {
    const { dismissBreach, markBreachAsSeen } = useModuleCommands(breachesApi);
    return {
        dismissBreach: (id) => {
            logUserDismissSecurityAlert(id);
            return dismissBreach({ id });
        },
        markBreachAsSeen: (id) => {
            logUserReceiveSecurityAlert(id);
            return markBreachAsSeen({ id });
        },
    };
};
