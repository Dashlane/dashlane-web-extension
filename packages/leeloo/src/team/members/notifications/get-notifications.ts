import {
  GetTeamBillingInformationResult,
  GetTeamTrialStatusResult,
  Policies,
} from "@dashlane/team-admin-contracts";
import { Lee } from "../../../lee";
import { getCurrentTeamId } from "../../../libs/carbon/spaces";
import { getDaysLeftInTrial } from "../../../libs/trial/helpers";
export const NotificationTypes = {
  TRIAL_PERIOD_0_15D: "TRIAL_PERIOD_0_15D",
  TRIAL_PERIOD_15_30D: "TRIAL_PERIOD_15_30D",
  GRACE_PERIOD_PAID: "GRACE_PERIOD_PAID",
  ENABLE_RECOVERY: "ENABLE_RECOVERY",
  ADD_ADMINS: "ADD_ADMINS",
  TAC_IN_EXTENSION: "TAC_IN_EXTENSION",
};
export const getNotifications = ({
  lee,
  teamTrialStatus,
  teamBillingInfo,
  teamPolicies,
  showTacInExtension,
}: {
  lee: Lee;
  teamTrialStatus: GetTeamTrialStatusResult;
  teamBillingInfo: GetTeamBillingInformationResult;
  teamPolicies: Policies;
  showTacInExtension: boolean;
}) => {
  const toShow = new Set();
  if (showTacInExtension) {
    toShow.add(NotificationTypes.TAC_IN_EXTENSION);
  }
  if (teamTrialStatus.isGracePeriod && !teamTrialStatus.isFreeTrial) {
    toShow.add(NotificationTypes.GRACE_PERIOD_PAID);
  }
  if (teamTrialStatus.isFreeTrial && !teamTrialStatus.isGracePeriod) {
    const daysLeft = getDaysLeftInTrial(
      teamBillingInfo.nextBillingDetails.dateUnix
    );
    if (daysLeft < 15) {
      toShow.add(NotificationTypes.TRIAL_PERIOD_15_30D);
    } else {
      toShow.add(NotificationTypes.TRIAL_PERIOD_0_15D);
    }
  }
  if (!teamPolicies.recoveryEnabled && !teamPolicies.ssoEnabled) {
    toShow.add(NotificationTypes.ENABLE_RECOVERY);
  }
  const teamId = getCurrentTeamId(lee.globalState) || 0;
  const currentSpace = lee.carbon.spaceData.spaces.find(
    (space) => teamId === +space.teamId
  );
  if (currentSpace && currentSpace.details.teamAdmins.length <= 1) {
    toShow.add(NotificationTypes.ADD_ADMINS);
  }
  return toShow;
};
