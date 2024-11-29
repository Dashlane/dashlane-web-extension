import { useFeatureFlip, useModuleQuery } from "@dashlane/framework-react";
import { DataStatus } from "@dashlane/carbon-api-consumers";
import { teamAdminNotificationsApi } from "@dashlane/team-admin-contracts";
import { useTeamTrialStatus } from "../../libs/hooks/use-team-trial-status";
import { useTeamCapabilities } from "../settings/hooks/use-team-capabilities";
import { B2BTrialInfobox } from "../activity/header/b2b-trial-infobox";
import { UpgradeBusinessInfobox } from "../activity/header/upgrade-business-infobox";
const REPACKAGE_RELEASE_FF = "monetization_extension_activity_logs_repackage";
const TRIAL_INFOBOX_FF = "monetization_extension_trial_activity_logs";
interface UseActivityInfoboxOutput {
  activityInfobox: JSX.Element | undefined;
  hasInfobox: boolean | null | undefined;
}
export const useActivityInfobox = (): UseActivityInfoboxOutput | null => {
  const teamCapabilities = useTeamCapabilities();
  const teamTrialStatus = useTeamTrialStatus();
  const hasSeenActivityLogsInfoboxQuery = useModuleQuery(
    teamAdminNotificationsApi,
    "hasSeenActivityLogsInfobox"
  );
  const hasReleaseFF = useFeatureFlip(REPACKAGE_RELEASE_FF);
  const hasTrialInfoboxFF = useFeatureFlip(TRIAL_INFOBOX_FF);
  const hasActivityLogPaywall = !teamCapabilities?.activityLog.enabled;
  if (
    !teamTrialStatus ||
    hasSeenActivityLogsInfoboxQuery.status !== DataStatus.Success
  ) {
    return null;
  }
  const displayUpgradeBusinessInfobox =
    hasReleaseFF &&
    hasActivityLogPaywall &&
    !hasSeenActivityLogsInfoboxQuery.data;
  const displayBuyDashlaneInfobox =
    hasTrialInfoboxFF && teamTrialStatus.isFreeTrial;
  const activityInfobox = displayBuyDashlaneInfobox ? (
    <B2BTrialInfobox />
  ) : displayUpgradeBusinessInfobox ? (
    <UpgradeBusinessInfobox />
  ) : undefined;
  const hasInfobox = !!activityInfobox;
  return {
    activityInfobox,
    hasInfobox,
  };
};
