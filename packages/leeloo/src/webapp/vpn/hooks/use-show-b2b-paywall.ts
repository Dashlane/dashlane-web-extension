import { FEATURE_FLIPS_WITHOUT_MODULE } from '@dashlane/framework-dashlane-application';
import { DataStatus, useFeatureFlip } from '@dashlane/framework-react';
import { isAccountBusinessAdmin, isAccountTeamTrialBusiness, isStarterTier, } from 'libs/account/helpers';
import { usePremiumStatus } from 'libs/carbon/hooks/usePremiumStatus';
export function useShowB2BPaywall(): boolean | null {
    const premiumStatus = usePremiumStatus();
    const isPaywallUpdateFFOn = useFeatureFlip(FEATURE_FLIPS_WITHOUT_MODULE.EcommerceWebPaywallUpdate);
    if (premiumStatus.status !== DataStatus.Success ||
        !premiumStatus.data ||
        isPaywallUpdateFFOn === undefined ||
        isPaywallUpdateFFOn === null) {
        return null;
    }
    if (!isPaywallUpdateFFOn) {
        return false;
    }
    const isB2BAdminInTrial = isAccountTeamTrialBusiness(premiumStatus.data) &&
        isAccountBusinessAdmin(premiumStatus.data);
    const isStarterPlanAdmin = isStarterTier(premiumStatus.data) &&
        isAccountBusinessAdmin(premiumStatus.data);
    return isB2BAdminInTrial || isStarterPlanAdmin;
}
