import { LoginNotification } from "@dashlane/communication";
import {
  ADD_NEW_LOGIN_NOTIFICATION,
  NewNotificationAction,
  RESET_ALL_LOGIN_NOTIFICATIONS,
} from "./actions";
import { LoginNotificationState } from "./types";
function getEmptyNotificationData(): LoginNotificationState {
  return [];
}
export default (
  state = getEmptyNotificationData(),
  action: NewNotificationAction
): LoginNotification[] => {
  switch (action.type) {
    case ADD_NEW_LOGIN_NOTIFICATION: {
      return [...state, action.notification];
    }
    case RESET_ALL_LOGIN_NOTIFICATIONS: {
      return getEmptyNotificationData();
    }
    default:
      return state;
  }
};
