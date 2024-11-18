import { LoginNotification } from "@dashlane/communication";
import { Query } from "Shared/Api";
export type LoginNotificationsQueries = {
  getLoginNotifications: Query<void, LoginNotification[]>;
};
