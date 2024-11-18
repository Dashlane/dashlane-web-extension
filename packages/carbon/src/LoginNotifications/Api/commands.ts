import {
  ClearAllStoredLoginNotificationResult,
  LoginNotification,
} from "@dashlane/communication";
import { Command } from "Shared/Api";
export type LoginNotificationsCommands = {
  addLoginNotification: Command<LoginNotification, void>;
  clearAllStoredLoginNotification: Command<
    void,
    ClearAllStoredLoginNotificationResult
  >;
};
