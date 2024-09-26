import { LoginNotification } from "@dashlane/communication";
export const ADD_NEW_LOGIN_NOTIFICATION = "ADD_NEW_LOGIN_NOTIFICATION";
export const RESET_ALL_LOGIN_NOTIFICATIONS = "RESET_ALL_LOGIN_NOTIFICATIONS";
export type NewNotificationAction = AddNewNotification | ResetAllNotification;
export interface AddNewNotification {
  type: typeof ADD_NEW_LOGIN_NOTIFICATION;
  notification: LoginNotification;
}
export const addNewLoginNotification = (
  notification: LoginNotification
): AddNewNotification => ({
  type: ADD_NEW_LOGIN_NOTIFICATION,
  notification,
});
export interface ResetAllNotification {
  type: typeof RESET_ALL_LOGIN_NOTIFICATIONS;
}
export const resetAllLoginNotification = (): ResetAllNotification => ({
  type: RESET_ALL_LOGIN_NOTIFICATIONS,
});
