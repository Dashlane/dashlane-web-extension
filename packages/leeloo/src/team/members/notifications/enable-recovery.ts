import { NotificationName } from '@dashlane/communication';
import { AlertSeverity } from '@dashlane/ui-components';
import { Lee } from 'lee';
import { showNotification } from './notification';
export const showEnableRecoveryNotification = (lee: Lee) => {
    const key = 'team_notifications_enable_account_recovery_markup';
    const redirectPath = `${lee.routes.teamSettingsRoutePath}/master-password-policies`;
    showNotification({
        lee,
        notificationKey: key,
        level: AlertSeverity.WARNING,
        redirectPath,
        notificationName: NotificationName.TacEnableAccountRecoveryBanner,
    });
};
