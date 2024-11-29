import reducer from "./reducer";
import { Notification, State } from "./types";
export const addNotification = reducer.registerAction(
  "ADD_NOTIFICATION",
  (state: State, notification: Notification) => {
    return {
      ...state,
      list: state.list
        .filter((n) => n.key !== notification.key)
        .concat(notification),
    };
  }
);
export const removeNotification = reducer.registerAction(
  "REMOVE_NOTIFICATION",
  (state: State, notificationKey: string) => {
    return {
      ...state,
      list: state.list.filter((n) => n.key !== notificationKey),
    };
  }
);
export const clearNotifications = reducer.registerAction<void>(
  "CLEAR_NOTIFICATIONS",
  (state: State) => {
    return {
      ...state,
      list: [],
    };
  }
);
