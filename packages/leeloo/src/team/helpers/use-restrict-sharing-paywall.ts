import { SpaceTier } from "@dashlane/team-admin-contracts";
import { useSubscriptionCode } from "../../libs/hooks/use-subscription-code";
import { useTeamTrialStatus } from "../../libs/hooks/use-team-trial-status";
import { AdminAccess } from "../../user/permissions";
export type RestrictSharingPaywallDetails = {
  shouldShowBuyPaywall: boolean;
  shouldShowUpgradePaywall: boolean;
  accountSubscriptionCode: string;
};
export function useRestrictSharingPaywallDetails(
  adminAccess: AdminAccess
): RestrictSharingPaywallDetails | null {
  const subscriptionCode = useSubscriptionCode();
  const teamTrialStatus = useTeamTrialStatus();
  if (!teamTrialStatus) {
    return null;
  }
  const hasBillingAccess = adminAccess.hasBillingAccess;
  const isTrialOrGracePeriod =
    teamTrialStatus.isFreeTrial || teamTrialStatus.isGracePeriod;
  return {
    shouldShowBuyPaywall: hasBillingAccess && isTrialOrGracePeriod,
    shouldShowUpgradePaywall:
      hasBillingAccess &&
      !isTrialOrGracePeriod &&
      teamTrialStatus.spaceTier !== SpaceTier.Business &&
      teamTrialStatus.spaceTier !== SpaceTier.BusinessPlus,
    accountSubscriptionCode: subscriptionCode ?? "",
  };
}
