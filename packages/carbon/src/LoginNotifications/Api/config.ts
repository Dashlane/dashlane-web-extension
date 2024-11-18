import { CommandQueryBusConfig } from "Shared/Infrastructure";
import { LoginNotificationsCommands } from "LoginNotifications/Api/commands";
import { LoginNotificationsQueries } from "LoginNotifications/Api/queries";
import { LoginNotificationsLiveQueries } from "LoginNotifications/Api/live-queries";
import { loginNotificationListSelector } from "LoginNotifications/selectors";
import { clearAllStoredLoginNotification } from "LoginNotifications/services/clearAllStoredLoginNotification";
import { loginNotificationList$ } from "LoginNotifications/live";
import { addLoginNotification } from "Login/helpers/notifications";
export const config: CommandQueryBusConfig<
  LoginNotificationsCommands,
  LoginNotificationsQueries,
  LoginNotificationsLiveQueries
> = {
  commands: {
    addLoginNotification: { handler: addLoginNotification },
    clearAllStoredLoginNotification: {
      handler: clearAllStoredLoginNotification,
    },
  },
  queries: {
    getLoginNotifications: {
      selector: loginNotificationListSelector,
    },
  },
  liveQueries: {
    liveLoginNotifications: {
      operator: loginNotificationList$,
    },
  },
};
