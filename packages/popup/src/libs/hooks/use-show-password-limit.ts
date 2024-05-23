import { DataStatus, useFeatureFlips } from '@dashlane/framework-react';
import { FEATURE_FLIPS_WITHOUT_MODULE } from '@dashlane/framework-dashlane-application';
import { useCredentialLimitStatus } from 'libs/api';
export function useShowPasswordLimit(): {
    shouldDisplayPasswordLimitAlmostReachedBanner: boolean;
    shouldDisplayPasswordLimitBanner: boolean;
    passwordsLeft?: number;
} | null {
    const featureFlipsResult = useFeatureFlips();
    let isB2CRestrictPasswordFreePlan_phase2 = false;
    let isB2CRestrictPasswordFreePlan_phase1 = false;
    if (featureFlipsResult.status === DataStatus.Success) {
        isB2CRestrictPasswordFreePlan_phase2 =
            featureFlipsResult.data[FEATURE_FLIPS_WITHOUT_MODULE.B2CRestrictPasswordFreePlanPhase2] ?? false;
        isB2CRestrictPasswordFreePlan_phase1 =
            featureFlipsResult.data[FEATURE_FLIPS_WITHOUT_MODULE.B2CRestrictPasswordFreePlanPhase1] ?? false;
    }
    const credentialLimitStatus = useCredentialLimitStatus();
    if (featureFlipsResult.status !== DataStatus.Success ||
        credentialLimitStatus.isLoading) {
        return null;
    }
    return {
        shouldDisplayPasswordLimitAlmostReachedBanner: credentialLimitStatus.shouldShowNearLimitContent &&
            isB2CRestrictPasswordFreePlan_phase2,
        shouldDisplayPasswordLimitBanner: credentialLimitStatus.shouldShowAtOrOverLimitContent &&
            isB2CRestrictPasswordFreePlan_phase1,
        passwordsLeft: credentialLimitStatus.passwordsLeft,
    };
}
