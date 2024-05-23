import { Team } from 'libs/api/types';
import { Lee } from 'lee';
import { getCurrentTeamId } from 'libs/carbon/spaces';
import { getDaysLeftInTrial } from 'libs/trial/helpers';
export const NotificationTypes = {
    TRIAL_PERIOD_0_15D: 'TRIAL_PERIOD_0_15D',
    TRIAL_PERIOD_15_30D: 'TRIAL_PERIOD_15_30D',
    GRACE_PERIOD_PAID: 'GRACE_PERIOD_PAID',
    ENABLE_RECOVERY: 'ENABLE_RECOVERY',
    ADD_ADMINS: 'ADD_ADMINS',
    TAC_IN_EXTENSION: 'TAC_IN_EXTENSION',
};
export const getNotifications = ({ lee, teamStatus, showTacInExtension, }: {
    lee: Lee;
    teamStatus: Team;
    showTacInExtension: boolean;
}) => {
    const toShow = new Set();
    if (showTacInExtension) {
        toShow.add(NotificationTypes.TAC_IN_EXTENSION);
    }
    if (teamStatus.isGracePeriod && !teamStatus.isFreeTrial) {
        toShow.add(NotificationTypes.GRACE_PERIOD_PAID);
    }
    if (teamStatus.isFreeTrial && !teamStatus.isGracePeriod) {
        const daysLeft = getDaysLeftInTrial(teamStatus.nextBillingDetails.dateUnix);
        if (daysLeft < 15) {
            toShow.add(NotificationTypes.TRIAL_PERIOD_15_30D);
        }
        else {
            toShow.add(NotificationTypes.TRIAL_PERIOD_0_15D);
        }
    }
    if (!teamStatus.info.recoveryEnabled && !teamStatus.info.ssoEnabled) {
        toShow.add(NotificationTypes.ENABLE_RECOVERY);
    }
    const teamId = getCurrentTeamId(lee.globalState) || 0;
    const currentSpace = lee.carbon.spaceData.spaces.find((space) => teamId === +space.teamId);
    if (currentSpace && currentSpace.details.teamAdmins.length <= 1) {
        toShow.add(NotificationTypes.ADD_ADMINS);
    }
    return toShow;
};
