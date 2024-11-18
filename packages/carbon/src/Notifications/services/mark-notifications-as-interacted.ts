import { NotificationName } from "@dashlane/communication";
import { CoreServices } from "Services";
import { markAsInteracted } from "Session/Store/notifications/actions";
import { notificationsStatusSelector } from "Session/Store/notifications/selectors";
export const markNotificationAsInteracted = async (
  services: CoreServices,
  notification: NotificationName
): Promise<void> => {
  const { storeService, localStorageService } = services;
  storeService.dispatch(markAsInteracted(notification));
  const notificationsStatus = notificationsStatusSelector(
    storeService.getState()
  );
  localStorageService
    .getInstance()
    .storeNotificationsStatus(notificationsStatus);
};
