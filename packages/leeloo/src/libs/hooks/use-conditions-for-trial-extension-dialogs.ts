import { DataStatus, useFeatureFlip, useModuleQueries, } from '@dashlane/framework-react';
import { teamAdminNotificationsApi } from '@dashlane/team-admin-contracts';
import { useTeamTrialStatus } from './use-team-trial-status';
const OFFER_TO_EXTEND_TRIAL_FF = 'ecommerce_web_offerToExtend_phase1';
export const useConditionsForTrialExtensionDialogs = (): boolean | null => {
    const teamTrialStatus = useTeamTrialStatus();
    const { hasSeenNotificationTrialExtended, hasSeenOfferToExtendFreeTrial } = useModuleQueries(teamAdminNotificationsApi, {
        hasSeenNotificationTrialExtended: {},
        hasSeenOfferToExtendFreeTrial: {},
    }, []);
    const extendFreeTrialDialogFF = useFeatureFlip(OFFER_TO_EXTEND_TRIAL_FF);
    if (!teamTrialStatus ||
        hasSeenNotificationTrialExtended.status !== DataStatus.Success ||
        hasSeenOfferToExtendFreeTrial.status !== DataStatus.Success ||
        extendFreeTrialDialogFF === null ||
        extendFreeTrialDialogFF === undefined) {
        return null;
    }
    const mightShowExtendFreeTrialDialog = (teamTrialStatus.isFreeTrial &&
        !teamTrialStatus.isGracePeriod &&
        !teamTrialStatus.daysLeftInTrial &&
        !hasSeenOfferToExtendFreeTrial.data) ||
        (teamTrialStatus.isGracePeriod && !hasSeenNotificationTrialExtended.data);
    return extendFreeTrialDialogFF && mightShowExtendFreeTrialDialog;
};
