import { CommandQueryBusConfig } from "Shared/Infrastructure";
import { NotificationsCommands } from "Notifications/Api/commands";
import { NotificationsQueries } from "Notifications/Api/queries";
import { NotificationsLiveQueries } from "Notifications/Api/live-queries";
import { markNotificationAsInteracted } from "Notifications/services/mark-notifications-as-interacted";
import { markNotificationAsSeen } from "Notifications/services/mark-notifications-as-seen";
import { markNotificationAsUnseen } from "Notifications/services/mark-notifications-as-unseen";
import { notificationsStatus$ } from "Session/Store/notifications/live";
import { notificationsStatusSelector } from "Session/Store/notifications/selectors";
export const config: CommandQueryBusConfig<
  NotificationsCommands,
  NotificationsQueries,
  NotificationsLiveQueries
> = {
  commands: {
    markNotificationAsInteracted: { handler: markNotificationAsInteracted },
    markNotificationAsSeen: { handler: markNotificationAsSeen },
    markNotificationAsUnseen: { handler: markNotificationAsUnseen },
  },
  queries: {
    getNotificationStatus: { selector: notificationsStatusSelector },
  },
  liveQueries: {
    liveNotificationStatus: { operator: notificationsStatus$ },
  },
};
