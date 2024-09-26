import { slot } from "ts-event-bus";
import { liveSlot } from "../CarbonApi";
import {
  ClearAllStoredLoginNotificationResult,
  LoginNotification,
} from "./types";
export const loginNotificationsCommandsSlots = {
  addLoginNotification: slot<LoginNotification, void>(),
  clearAllStoredLoginNotification: slot<
    void,
    ClearAllStoredLoginNotificationResult
  >(),
};
export const loginNotificationsQueriesSlots = {
  getLoginNotifications: slot<void, LoginNotification[]>(),
};
export const loginNotificationsLiveQueriesSlots = {
  liveLoginNotifications: liveSlot<LoginNotification[]>(),
};
