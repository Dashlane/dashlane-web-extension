import { Action } from "Store";
import { NotificationName, Notifications } from "@dashlane/communication";
export const MARK_AS_SEEN = "MarkAsSeen";
export const MARK_AS_UNSEEN = "MarkAsUnseen";
export const MARK_AS_INTERACTED = "MarkAsInteracted";
export const LOAD_NOTIFICATIONS_STATE = "LoadNotificationsState";
type ActionType =
  | typeof MARK_AS_SEEN
  | typeof MARK_AS_UNSEEN
  | typeof MARK_AS_INTERACTED
  | typeof LOAD_NOTIFICATIONS_STATE;
interface MarkAsSeenAction extends Action {
  type: ActionType;
  notification: NotificationName;
}
interface MarkAsUnseenAction extends Action {
  type: ActionType;
  notification: NotificationName;
}
interface MarkAsInteractedAction extends Action {
  type: ActionType;
  notification: NotificationName;
}
interface LoadNotificationsStatusAction extends Action {
  type: ActionType;
  state: Notifications;
}
export const markAsSeen = (
  notification: NotificationName
): MarkAsSeenAction => ({
  type: MARK_AS_SEEN,
  notification: notification,
});
export const markAsUnseen = (
  notification: NotificationName
): MarkAsUnseenAction => ({
  type: MARK_AS_UNSEEN,
  notification: notification,
});
export const markAsInteracted = (
  notification: NotificationName
): MarkAsInteractedAction => ({
  type: MARK_AS_INTERACTED,
  notification: notification,
});
export const loadNotificationsStatus = (
  notificationsStatus: Notifications
): LoadNotificationsStatusAction => ({
  type: LOAD_NOTIFICATIONS_STATE,
  state: notificationsStatus,
});
export type NotificationsStatusAction =
  | MarkAsSeenAction
  | MarkAsUnseenAction
  | MarkAsInteractedAction
  | LoadNotificationsStatusAction;
