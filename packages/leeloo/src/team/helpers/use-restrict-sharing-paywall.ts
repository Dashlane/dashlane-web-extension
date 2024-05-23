import { SpaceTier } from '@dashlane/team-admin-contracts';
import { useAccountInfo } from 'libs/carbon/hooks/useAccountInfo';
import { useTeamTrialStatus } from 'libs/hooks/use-team-trial-status';
import { AdminAccess } from 'user/permissions';
export type RestrictSharingPaywallDetails = {
    shouldShowBuyPaywall: boolean;
    shouldShowUpgradePaywall: boolean;
    accountSubscriptionCode: string;
};
export function useRestrictSharingPaywallDetails(adminAccess: AdminAccess): RestrictSharingPaywallDetails | null {
    const accountInfo = useAccountInfo();
    const teamTrialStatus = useTeamTrialStatus();
    if (!teamTrialStatus || !accountInfo) {
        return null;
    }
    const hasBillingAccess = adminAccess.hasBillingAccess;
    const isTrialOrGracePeriod = teamTrialStatus.isFreeTrial || teamTrialStatus.isGracePeriod;
    return {
        shouldShowBuyPaywall: hasBillingAccess && isTrialOrGracePeriod,
        shouldShowUpgradePaywall: hasBillingAccess &&
            !isTrialOrGracePeriod &&
            teamTrialStatus.spaceTier !== SpaceTier.Business,
        accountSubscriptionCode: accountInfo?.subscriptionCode ?? '',
    };
}
