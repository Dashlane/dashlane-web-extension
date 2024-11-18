import { NotificationName } from "@dashlane/communication";
import { CoreServices } from "Services";
import { markAsUnseen } from "Session/Store/notifications/actions";
import { notificationsStatusSelector } from "Session/Store/notifications/selectors";
export const markNotificationAsUnseen = async (
  services: CoreServices,
  notification: NotificationName
): Promise<void> => {
  const { storeService, localStorageService } = services;
  storeService.dispatch(markAsUnseen(notification));
  const notificationsStatus = notificationsStatusSelector(
    storeService.getState()
  );
  localStorageService
    .getInstance()
    .storeNotificationsStatus(notificationsStatus);
};
