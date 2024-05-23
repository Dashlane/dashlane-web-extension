import { NotificationStatus } from '@dashlane/communication';
import { browser } from '@dashlane/browser-utils';
import { clearNotifications } from 'libs/notifications/actions';
import { Team } from 'libs/api/types';
import { carbonConnector } from 'libs/carbon/connector';
import { Lee } from 'lee';
import { showPaidGracePeriodNotification } from './grace-period';
import { showEnableRecoveryNotification } from './enable-recovery';
import { showAddAdminsNotification } from './add-admins';
import { getNotifications, NotificationTypes } from './get-notifications';
import { showFreeTrialD0To15Notification } from './trial-period';
import { showTacInExtensionNotification } from './tac-in-extension';
import { TranslatorInterface } from 'libs/i18n/types';
export const updateNotifications = async ({ lee, teamStatus, showTacInExtension, translate, setIsVaultNavigationModalOpen, isTacGetStartedFFEnabled, }: {
    lee: Lee;
    teamStatus: Team;
    showTacInExtension: boolean;
    translate: TranslatorInterface;
    isTacGetStartedFFEnabled: boolean;
    setIsVaultNavigationModalOpen: (isVaultNavigationOpen: boolean) => void;
}) => {
    const notifications = getNotifications({
        lee,
        teamStatus,
        showTacInExtension,
    });
    lee.dispatchGlobal(clearNotifications());
    const isFullAdmin = lee.permission.adminAccess.hasFullAccess;
    const notificationStatus = await carbonConnector.getNotificationStatus();
    if (notifications.has(NotificationTypes.TAC_IN_EXTENSION) &&
        notificationStatus.tacGetTheExtensionBanner === NotificationStatus.Unseen &&
        !browser.isSafari() &&
        !APP_PACKAGED_IN_EXTENSION &&
        !isTacGetStartedFFEnabled) {
        showTacInExtensionNotification({ lee, setIsVaultNavigationModalOpen });
    }
    if (notifications.has(NotificationTypes.GRACE_PERIOD_PAID)) {
        showPaidGracePeriodNotification(lee);
    }
    if (isFullAdmin) {
        if (notifications.has(NotificationTypes.ENABLE_RECOVERY) &&
            notificationStatus.tacEnableAccountRecoveryBanner ===
                NotificationStatus.Unseen &&
            !isTacGetStartedFFEnabled) {
            showEnableRecoveryNotification(lee);
        }
        if (notifications.has(NotificationTypes.ADD_ADMINS) &&
            notificationStatus.tacOnlyOneAdminBanner === NotificationStatus.Unseen &&
            !browser.isSafari() &&
            APP_PACKAGED_IN_EXTENSION &&
            !isTacGetStartedFFEnabled) {
            showAddAdminsNotification(lee);
        }
    }
    if (notifications.has(NotificationTypes.TRIAL_PERIOD_0_15D)) {
        showFreeTrialD0To15Notification({
            lee,
            spaceTier: teamStatus.planTier,
            translate,
        });
    }
};
