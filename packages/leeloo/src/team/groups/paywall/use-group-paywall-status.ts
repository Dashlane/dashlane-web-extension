import { UserGroupDownload } from "@dashlane/communication";
import { DataStatus, useFeatureFlip } from "@dashlane/framework-react";
import { isBusinessTier } from "../../../libs/account/helpers";
import { useTeamTrialStatus } from "../../../libs/hooks/use-team-trial-status";
import { usePremiumStatus } from "../../../libs/carbon/hooks/usePremiumStatus";
import { useDiscontinuedStatus } from "../../../libs/carbon/hooks/useNodePremiumStatus";
import { useTeamCapabilities } from "../../settings/hooks/use-team-capabilities";
const GROUP_FEATURE_FLIP = "monetization_extension_group_sharing_repackage";
export interface UseGroupPaywallStatusOutput {
  displayStarterPaywall: boolean;
  enforceStarterPaywall: boolean;
  displayInTrialBusinessPaywall: boolean;
}
export const useGroupPaywallStatus = (
  userGroups: UserGroupDownload[]
): UseGroupPaywallStatusOutput => {
  const teamTrialStatus = useTeamTrialStatus();
  const premiumStatus = usePremiumStatus();
  const hasFeatureFlip = useFeatureFlip(GROUP_FEATURE_FLIP);
  const teamCapabilities = useTeamCapabilities();
  const discontinuedStatus = useDiscontinuedStatus();
  const isTeamSoftDiscontinued =
    !discontinuedStatus.isLoading && discontinuedStatus.isTeamSoftDiscontinued;
  if (
    premiumStatus.status !== DataStatus.Success ||
    !hasFeatureFlip ||
    isTeamSoftDiscontinued
  ) {
    return {
      displayStarterPaywall: false,
      enforceStarterPaywall: false,
      displayInTrialBusinessPaywall: false,
    };
  }
  const limit = teamCapabilities?.groupSharing.info?.limit;
  const displayStarterPaywall = !!limit;
  const enforceStarterPaywall =
    displayStarterPaywall && userGroups.length >= limit;
  const displayInTrialBusinessPaywall =
    isBusinessTier(premiumStatus.data) && !!teamTrialStatus?.isFreeTrial;
  return {
    displayStarterPaywall,
    enforceStarterPaywall,
    displayInTrialBusinessPaywall,
  };
};
