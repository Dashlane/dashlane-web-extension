import { Notifications } from "@dashlane/communication";
import { LiveQuery } from "Shared/Api";
export type NotificationsLiveQueries = {
  liveNotificationStatus: LiveQuery<void, Notifications>;
};
