import { Diff } from "utility-types";
import { Notifications } from "@dashlane/communication";
import { carbonConnector } from "../../libs/carbon/connector";
import { connect, Selector } from "../../libs/carbonApiConsumer";
import { remoteDataAdapter } from "../../libs/remoteDataAdapter";
import NotificationsDropdown, { Props } from "./notifications-dropdown";
interface InjectedProps {
  notifications: Notifications;
}
type WrapperProps = Diff<Props, InjectedProps>;
const notificationsSelector: Selector<Notifications, WrapperProps, void> = {
  live: carbonConnector.liveNotificationStatus,
  query: carbonConnector.getNotificationStatus,
};
const selectors = {
  notifications: notificationsSelector,
};
const remoteDataConfig = {
  strategies: selectors,
};
export const Connected = connect(
  remoteDataAdapter<InjectedProps, Props>(
    NotificationsDropdown,
    remoteDataConfig
  ),
  selectors
);
