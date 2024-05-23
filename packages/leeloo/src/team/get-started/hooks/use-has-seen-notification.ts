import { DataStatus, useModuleCommands, useModuleQuery, } from '@dashlane/framework-react';
import { teamGetStartedApi } from '@dashlane/team-admin-contracts';
export interface UseHasSeenNotification {
    status: DataStatus;
    hasSeenNotification: boolean | null;
    markNotificationAsSeen: () => void;
}
export const useHasSeenNotification = (notification: string): UseHasSeenNotification => {
    const { data, status } = useModuleQuery(teamGetStartedApi, 'hasSeenNotification', {
        notification,
    });
    const { markNotificationAsSeen } = useModuleCommands(teamGetStartedApi);
    return {
        status,
        hasSeenNotification: status === DataStatus.Success ? data : null,
        markNotificationAsSeen: () => {
            markNotificationAsSeen({ notification });
        },
    };
};
