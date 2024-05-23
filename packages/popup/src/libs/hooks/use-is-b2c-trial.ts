import { useNodePremiumStatus } from 'libs/api';
export function useIsB2CTrial(): boolean | null {
    const premiumStatus = useNodePremiumStatus();
    if (!premiumStatus) {
        return null;
    }
    return ((premiumStatus.isTrial ?? false) &&
        Object.keys(premiumStatus.b2bStatus?.currentTeam ?? {}).length === 0);
}
