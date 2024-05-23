import { useFeatureFlip } from '@dashlane/framework-react';
import { FEATURE_FLIPS_WITHOUT_MODULE } from '@dashlane/framework-dashlane-application';
import { useDiscontinuedStatus } from 'src/libs/api';
export const useShowB2BDiscontinuationBanner = () => {
    const hasB2BDiscontinuationFF = useFeatureFlip(FEATURE_FLIPS_WITHOUT_MODULE.EcommerceWebB2BDiscontinuationPhase1);
    const discontinuedStatus = useDiscontinuedStatus();
    if (discontinuedStatus.isLoading ||
        typeof hasB2BDiscontinuationFF !== 'boolean') {
        return null;
    }
    return (hasB2BDiscontinuationFF &&
        !!discontinuedStatus.isTeamSoftDiscontinued &&
        !!discontinuedStatus.isTrial);
};
