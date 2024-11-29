import {
  GetTeamBillingInformationResult,
  GetTeamTrialStatusResult,
  Policies,
} from "@dashlane/team-admin-contracts";
import { NotificationStatus } from "@dashlane/communication";
import { browser } from "@dashlane/browser-utils";
import { clearNotifications } from "../../../libs/notifications/actions";
import { carbonConnector } from "../../../libs/carbon/connector";
import { Lee } from "../../../lee";
import { showPaidGracePeriodNotification } from "./grace-period";
import { showEnableRecoveryNotification } from "./enable-recovery";
import { showAddAdminsNotification } from "./add-admins";
import { getNotifications, NotificationTypes } from "./get-notifications";
import { showFreeTrialD0To15Notification } from "./trial-period";
import { TranslatorInterface } from "../../../libs/i18n/types";
export const updateNotifications = async ({
  lee,
  teamTrialStatus,
  teamBillingInfo,
  teamPolicies,
  showTacInExtension,
  translate,
}: {
  lee: Lee;
  teamTrialStatus: GetTeamTrialStatusResult;
  teamBillingInfo: GetTeamBillingInformationResult;
  teamPolicies: Policies;
  showTacInExtension: boolean;
  translate: TranslatorInterface;
}) => {
  const notifications = getNotifications({
    lee,
    teamTrialStatus,
    teamBillingInfo,
    teamPolicies,
    showTacInExtension,
  });
  lee.dispatchGlobal(clearNotifications());
  const isFullAdmin = lee.permission.adminAccess.hasFullAccess;
  const notificationStatus = await carbonConnector.getNotificationStatus();
  if (notifications.has(NotificationTypes.GRACE_PERIOD_PAID)) {
    showPaidGracePeriodNotification(lee);
  }
  if (isFullAdmin) {
    if (
      notifications.has(NotificationTypes.ENABLE_RECOVERY) &&
      notificationStatus.tacEnableAccountRecoveryBanner ===
        NotificationStatus.Unseen
    ) {
      showEnableRecoveryNotification(lee);
    }
    if (
      notifications.has(NotificationTypes.ADD_ADMINS) &&
      notificationStatus.tacOnlyOneAdminBanner === NotificationStatus.Unseen &&
      !browser.isSafari() &&
      APP_PACKAGED_IN_EXTENSION
    ) {
      showAddAdminsNotification(lee);
    }
  }
  if (notifications.has(NotificationTypes.TRIAL_PERIOD_0_15D)) {
    showFreeTrialD0To15Notification({
      lee,
      spaceTier: teamBillingInfo.spaceTier,
      translate,
    });
  }
};
