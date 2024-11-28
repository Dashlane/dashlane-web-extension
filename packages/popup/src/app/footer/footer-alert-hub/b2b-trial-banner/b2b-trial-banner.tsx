import { jsx } from "@dashlane/design-system";
import { SpaceTier } from "@dashlane/team-admin-contracts";
import { useTeamTrialStatus } from "../../../../libs/hooks/use-team-trial-status";
import { GracePeriodBanner } from "./grace-period-banner";
import { EarlyTrialBanner } from "./early-trial-banner";
import { LateTrialBanner } from "./late-trial-banner";
export const BANNER_UTM_SOURCE_PARAM =
  "button:buy_dashlane+click_origin:banner+origin_page:item/credential/list+origin_component:extension_popup";
export const BusinessTrialBanner = () => {
  const teamTrialStatus = useTeamTrialStatus();
  if (!teamTrialStatus) {
    return null;
  }
  if (!teamTrialStatus.isFreeTrial) {
    return null;
  }
  const isTeam = teamTrialStatus.spaceTier === SpaceTier.Team;
  const isBusiness = teamTrialStatus.spaceTier === SpaceTier.Business;
  if (!isTeam && !isBusiness) {
    return null;
  }
  const isGracePeriod = teamTrialStatus.isGracePeriod;
  const daysLeftInTrial = teamTrialStatus.daysLeftInTrial;
  const bannerProps = {
    daysLeftInTrial,
    isBusiness,
  };
  return isGracePeriod ? (
    <GracePeriodBanner {...bannerProps} />
  ) : daysLeftInTrial && daysLeftInTrial > 7 ? (
    <EarlyTrialBanner {...bannerProps} />
  ) : (
    <LateTrialBanner {...bannerProps} />
  );
};
