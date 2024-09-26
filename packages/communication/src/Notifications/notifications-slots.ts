import { slot } from "ts-event-bus";
import { liveSlot } from "../CarbonApi";
import { NotificationName, Notifications } from "./types";
export const notificationsCommandsSlots = {
  markNotificationAsInteracted: slot<NotificationName, void>(),
  markNotificationAsSeen: slot<NotificationName, void>(),
  markNotificationAsUnseen: slot<NotificationName, void>(),
};
export const notificationsQueriesSlots = {
  getNotificationStatus: slot<void, Notifications>(),
};
export const notificationsLiveQueriesSlots = {
  liveNotificationStatus: liveSlot<Notifications>(),
};
