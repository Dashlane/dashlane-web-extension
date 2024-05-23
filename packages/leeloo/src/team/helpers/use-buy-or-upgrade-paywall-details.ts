import { useFeatureFlip } from '@dashlane/framework-react';
import { SpaceTier } from '@dashlane/team-admin-contracts';
import { FEATURE_FLIPS_WITHOUT_MODULE } from '@dashlane/framework-dashlane-application';
import { useAccountInfo } from 'libs/carbon/hooks/useAccountInfo';
import { useTeamTrialStatus } from 'libs/hooks/use-team-trial-status';
import { AdminAccess } from 'user/permissions';
const PAYWALL_UPDATE_FEATURE_FLIP = FEATURE_FLIPS_WITHOUT_MODULE.EcommerceWebPaywallUpdate;
export type UseBuyOrUpgradePaywallDetailsResult = {
    shouldShowBuyOrUpgradePaywall: boolean;
    isTrialOrGracePeriod: boolean;
    planType: SpaceTier;
    accountSubscriptionCode: string;
};
type InferredAdminAccess = {
    hasBillingAccess: boolean;
};
export function useBuyOrUpgradePaywallDetails(adminAccess: AdminAccess): UseBuyOrUpgradePaywallDetailsResult | null;
export function useBuyOrUpgradePaywallDetails(adminAccess: InferredAdminAccess): UseBuyOrUpgradePaywallDetailsResult | null;
export function useBuyOrUpgradePaywallDetails(adminAccess: AdminAccess | InferredAdminAccess): UseBuyOrUpgradePaywallDetailsResult | null {
    const accountInfo = useAccountInfo();
    const isPaywallUpdateFFOn = useFeatureFlip(PAYWALL_UPDATE_FEATURE_FLIP);
    const teamTrialStatus = useTeamTrialStatus();
    if (!teamTrialStatus ||
        isPaywallUpdateFFOn === null ||
        isPaywallUpdateFFOn === undefined) {
        return null;
    }
    let hasBillingAccess: boolean;
    if ('hasFullAccess' in adminAccess) {
        hasBillingAccess =
            adminAccess.hasFullAccess || adminAccess.hasBillingAccess;
    }
    else {
        hasBillingAccess = adminAccess.hasBillingAccess;
    }
    return {
        shouldShowBuyOrUpgradePaywall: (isPaywallUpdateFFOn && hasBillingAccess) ?? false,
        isTrialOrGracePeriod: teamTrialStatus.isFreeTrial || teamTrialStatus.isGracePeriod,
        planType: teamTrialStatus.spaceTier,
        accountSubscriptionCode: accountInfo?.subscriptionCode ?? '',
    };
}
