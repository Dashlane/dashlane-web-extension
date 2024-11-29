import { SpaceTier } from "@dashlane/team-admin-contracts";
import { useSubscriptionCode } from "../../libs/hooks/use-subscription-code";
import { useTeamTrialStatus } from "../../libs/hooks/use-team-trial-status";
import { AdminAccess } from "../../user/permissions";
export type UseBuyOrUpgradePaywallDetailsResult = {
  shouldShowBuyOrUpgradePaywall: boolean;
  isTrialOrGracePeriod: boolean;
  planType: SpaceTier;
  accountSubscriptionCode: string;
};
type InferredAdminAccess = {
  hasBillingAccess: boolean;
};
export function useBuyOrUpgradePaywallDetails(
  adminAccess: AdminAccess
): UseBuyOrUpgradePaywallDetailsResult | null;
export function useBuyOrUpgradePaywallDetails(
  adminAccess: InferredAdminAccess
): UseBuyOrUpgradePaywallDetailsResult | null;
export function useBuyOrUpgradePaywallDetails(
  adminAccess: AdminAccess | InferredAdminAccess
): UseBuyOrUpgradePaywallDetailsResult | null {
  const subscriptionCode = useSubscriptionCode();
  const teamTrialStatus = useTeamTrialStatus();
  if (!teamTrialStatus) {
    return null;
  }
  let hasBillingAccess: boolean;
  if ("hasFullAccess" in adminAccess) {
    hasBillingAccess =
      adminAccess.hasFullAccess || adminAccess.hasBillingAccess;
  } else {
    hasBillingAccess = adminAccess.hasBillingAccess;
  }
  return {
    shouldShowBuyOrUpgradePaywall: hasBillingAccess ?? false,
    isTrialOrGracePeriod:
      teamTrialStatus.isFreeTrial || teamTrialStatus.isGracePeriod,
    planType: teamTrialStatus.spaceTier,
    accountSubscriptionCode: subscriptionCode ?? "",
  };
}
