import { Notifications } from "@dashlane/communication";
import { Query } from "Shared/Api";
export type NotificationsQueries = {
  getNotificationStatus: Query<void, Notifications>;
};
