import { isAccountBusinessAdmin, isTeamTrial } from 'app/helpers';
import { useDiscontinuedStatus, usePremiumStatus } from 'libs/api';
export function useIsB2BTrial(): boolean | null {
    const premiumStatus = usePremiumStatus();
    const discontinuedStatus = useDiscontinuedStatus();
    if (!premiumStatus || discontinuedStatus.isLoading) {
        return null;
    }
    const isBusinessAdmin = isAccountBusinessAdmin(premiumStatus);
    const isInB2BTrial = isTeamTrial(premiumStatus);
    return (isBusinessAdmin &&
        isInB2BTrial &&
        !discontinuedStatus.isTeamSoftDiscontinued);
}
