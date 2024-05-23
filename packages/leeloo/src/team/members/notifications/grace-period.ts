import { AlertSeverity } from '@dashlane/ui-components';
import { Lee } from 'lee';
import { showNotification } from './notification';
const I18N_KEYS = {
    RENEWAL: 'team_notifications_renewal_grace_period_markup',
};
export const showPaidGracePeriodNotification = (lee: Lee) => {
    showNotification({
        lee,
        notificationKey: I18N_KEYS.RENEWAL,
        level: AlertSeverity.ERROR,
        redirectPath: lee.routes.teamAccountRoutePath,
    });
};
