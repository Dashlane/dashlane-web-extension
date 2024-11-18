import { LoginNotification } from "@dashlane/communication";
import { LiveQuery } from "Shared/Api";
export type LoginNotificationsLiveQueries = {
  liveLoginNotifications: LiveQuery<void, LoginNotification[]>;
};
