import { DataStatus, useModuleCommands, useModuleQuery, } from '@dashlane/framework-react';
import { getStartedApi } from '@dashlane/onboarding-contracts';
export interface UseHasDismissedGetStarted {
    status: DataStatus;
    isGetStartedDismissed: boolean;
    dismissGetStarted: () => void;
}
export const useHasDismissedGetStarted = (): UseHasDismissedGetStarted => {
    const { data, status } = useModuleQuery(getStartedApi, 'isGetStartedDismissed');
    const { dismissGetStarted } = useModuleCommands(getStartedApi);
    return {
        status,
        isGetStartedDismissed: status === DataStatus.Success ? data : false,
        dismissGetStarted: () => dismissGetStarted(undefined),
    };
};
