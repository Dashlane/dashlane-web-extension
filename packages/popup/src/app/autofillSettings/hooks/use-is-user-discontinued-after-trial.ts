import { useFeatureFlip } from '@dashlane/framework-react';
import { FEATURE_FLIPS_WITHOUT_MODULE } from '@dashlane/framework-dashlane-application';
import { useDiscontinuedStatus } from 'src/libs/api';
export const useIsUserDiscontinuedAfterTrial = (): boolean | null => {
    const discontinuedStatus = useDiscontinuedStatus();
    const hasB2BDiscontinuationFFEnabled = useFeatureFlip(FEATURE_FLIPS_WITHOUT_MODULE.EcommerceWebB2BDiscontinuationPhase2);
    if (discontinuedStatus.isLoading ||
        typeof hasB2BDiscontinuationFFEnabled !== 'boolean') {
        return null;
    }
    return (hasB2BDiscontinuationFFEnabled &&
        !!discontinuedStatus.isTeamSoftDiscontinued &&
        !!discontinuedStatus.isTrial);
};
