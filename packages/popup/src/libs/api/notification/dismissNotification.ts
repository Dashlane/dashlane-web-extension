import { NotificationName } from "@dashlane/communication";
import { carbonConnector } from "../../../carbonConnector";
export const dismissNotification = (notification: NotificationName) => {
  carbonConnector.markNotificationAsInteracted(notification);
};
