import { NotificationName } from "@dashlane/communication";
import { CoreServices } from "Services";
import { markAsSeen } from "Session/Store/notifications/actions";
import { notificationsStatusSelector } from "Session/Store/notifications/selectors";
export const markNotificationAsSeen = async (
  services: CoreServices,
  notification: NotificationName
): Promise<void> => {
  const { storeService, localStorageService } = services;
  storeService.dispatch(markAsSeen(notification));
  const notificationsStatus = notificationsStatusSelector(
    storeService.getState()
  );
  localStorageService
    .getInstance()
    .storeNotificationsStatus(notificationsStatus);
};
