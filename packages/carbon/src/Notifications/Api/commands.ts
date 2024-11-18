import { NotificationName } from "@dashlane/communication";
import { Command } from "Shared/Api";
export type NotificationsCommands = {
  markNotificationAsSeen: Command<NotificationName, void>;
  markNotificationAsInteracted: Command<NotificationName, void>;
  markNotificationAsUnseen: Command<NotificationName, void>;
};
