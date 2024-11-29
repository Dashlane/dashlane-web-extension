import { DataStatus, useModuleQueries } from "@dashlane/framework-react";
import { teamAdminNotificationsApi } from "@dashlane/team-admin-contracts";
import { useTeamTrialStatus } from "./use-team-trial-status";
export const useConditionsForTrialExtensionDialogs = (): boolean | null => {
  const teamTrialStatus = useTeamTrialStatus();
  const { hasSeenNotificationTrialExtended, hasSeenOfferToExtendFreeTrial } =
    useModuleQueries(
      teamAdminNotificationsApi,
      {
        hasSeenNotificationTrialExtended: {},
        hasSeenOfferToExtendFreeTrial: {},
      },
      []
    );
  if (
    !teamTrialStatus ||
    hasSeenNotificationTrialExtended.status !== DataStatus.Success ||
    hasSeenOfferToExtendFreeTrial.status !== DataStatus.Success
  ) {
    return null;
  }
  const mightShowExtendFreeTrialDialog =
    (teamTrialStatus.isFreeTrial &&
      !teamTrialStatus.isGracePeriod &&
      !teamTrialStatus.daysLeftInTrial &&
      !hasSeenOfferToExtendFreeTrial.data) ||
    (teamTrialStatus.isGracePeriod && !hasSeenNotificationTrialExtended.data);
  return mightShowExtendFreeTrialDialog;
};
