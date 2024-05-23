import { NotificationName } from '@dashlane/communication';
import { carbonConnector } from 'src/carbonConnector';
export const dismissNotification = (notification: NotificationName) => {
    carbonConnector.markNotificationAsInteracted(notification);
};
