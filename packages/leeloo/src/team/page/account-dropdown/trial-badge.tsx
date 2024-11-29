import { Badge } from "@dashlane/design-system";
import { SpaceTier } from "@dashlane/team-admin-contracts";
import { useDiscontinuedStatus } from "../../../libs/carbon/hooks/useNodePremiumStatus";
import { useTeamTrialStatus } from "../../../libs/hooks/use-team-trial-status";
import useTranslate from "../../../libs/i18n/useTranslate";
const I18N_KEYS = {
  GRACE_PERIOD: "free_trial_expired_badge",
  BUSINESS_DAYS_LEFT_TRIAL_SINGLE: "business_trial_days_left_badge",
  TEAM_DAYS_LEFT_TRIAL_SINGLE: "team_trial_days_left_badge",
  DISCONTINUED: "trial_ended_discontinued",
};
export const TrialBadge = () => {
  const teamTrialStatus = useTeamTrialStatus();
  const discontinuedStatus = useDiscontinuedStatus();
  const { translate } = useTranslate();
  if (
    !teamTrialStatus ||
    discontinuedStatus.isLoading ||
    discontinuedStatus.isTeamSoftDiscontinued === undefined ||
    discontinuedStatus.isTrial === undefined
  ) {
    return null;
  }
  const daysLeft = teamTrialStatus.daysLeftInTrial;
  const isTeam = teamTrialStatus.spaceTier === SpaceTier.Team;
  const isGracePeriod = teamTrialStatus.isGracePeriod;
  const shouldShowDiscontinuedBadge =
    discontinuedStatus.isTeamSoftDiscontinued && discontinuedStatus.isTrial;
  const getBadgeLabel = () => {
    if (shouldShowDiscontinuedBadge) {
      return translate(I18N_KEYS.DISCONTINUED);
    }
    if (isGracePeriod) {
      return translate(I18N_KEYS.GRACE_PERIOD);
    }
    return translate(
      isTeam
        ? I18N_KEYS.TEAM_DAYS_LEFT_TRIAL_SINGLE
        : I18N_KEYS.BUSINESS_DAYS_LEFT_TRIAL_SINGLE,
      { count: daysLeft }
    );
  };
  return (
    <Badge
      label={getBadgeLabel()}
      mood={isGracePeriod || shouldShowDiscontinuedBadge ? "warning" : "brand"}
      layout="labelOnly"
      intensity={isGracePeriod ? "catchy" : "quiet"}
      sx={{ marginTop: "3px" }}
    />
  );
};
