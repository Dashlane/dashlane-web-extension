import { NotificationName } from '@dashlane/communication';
import { AlertSeverity } from '@dashlane/ui-components';
import { Lee } from 'lee';
import { showNotification } from './notification';
export const showAddAdminsNotification = (lee: Lee) => {
    const key = 'team_notifications_add_admins_markup';
    const redirectPath = lee.routes.teamAccountRoutePath;
    showNotification({
        lee,
        notificationKey: key,
        level: AlertSeverity.WARNING,
        redirectPath,
        notificationName: NotificationName.TacOnlyOneAdminBanner,
    });
};
