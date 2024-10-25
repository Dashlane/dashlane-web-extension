import { Notifications, NotificationStatus } from "@dashlane/communication";
import {
  LOAD_NOTIFICATIONS_STATE,
  MARK_AS_INTERACTED,
  MARK_AS_SEEN,
  MARK_AS_UNSEEN,
  NotificationsStatusAction,
} from "Session/Store/notifications/actions";
const emptyState: Notifications = {
  paymentFailureChurned: NotificationStatus.Unseen,
  paymentFailureChurning: NotificationStatus.Unseen,
  switchToMlAnalysisEngine: NotificationStatus.Unseen,
  dWMb2bAutoEnrollTooltip: NotificationStatus.Unseen,
  tacGetTheExtensionBanner: NotificationStatus.Unseen,
  tacEnableAccountRecoveryBanner: NotificationStatus.Unseen,
  tacOnlyOneAdminBanner: NotificationStatus.Unseen,
  tacDarkWebInsightsNewBadge: NotificationStatus.Unseen,
  passwordHistoryBanner: NotificationStatus.Unseen,
  sharingCenterDisabledBanner: NotificationStatus.Unseen,
  accountRecoveryAvailableAdminTooltip: NotificationStatus.Unseen,
  activateInviteLink: NotificationStatus.Unseen,
  mpToSsoMigrationDoneDialog: NotificationStatus.Seen,
};
export function getEmptyNotificationsState(): Notifications {
  return emptyState;
}
export default (
  state = getEmptyNotificationsState(),
  action: NotificationsStatusAction
) => {
  switch (action.type) {
    case MARK_AS_INTERACTED:
      return {
        ...state,
        [action.notification]: NotificationStatus.Interacted,
      };
    case MARK_AS_SEEN:
      return {
        ...state,
        [action.notification]: NotificationStatus.Seen,
      };
    case MARK_AS_UNSEEN:
      return {
        ...state,
        [action.notification]: NotificationStatus.Unseen,
      };
    case LOAD_NOTIFICATIONS_STATE:
      return {
        ...state,
        ...action.state,
      };
    default:
      return state;
  }
};
