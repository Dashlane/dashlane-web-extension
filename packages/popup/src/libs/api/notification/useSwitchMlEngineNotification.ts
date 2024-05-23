import { NotificationStatus } from '@dashlane/communication';
import { useNotificationsStatusData } from 'libs/api/notification/useNotificationsStatusData';
import { DataStatus } from 'libs/api/types';
export function useHasUserInteractedWithSwitchToMlNotification(): boolean {
    const notificationsStatusData = useNotificationsStatusData();
    if (notificationsStatusData.status !== DataStatus.Success) {
        return false;
    }
    return (notificationsStatusData.data.switchToMlAnalysisEngine ===
        NotificationStatus.Interacted);
}
