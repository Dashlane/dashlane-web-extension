import { CarbonEndpointResult, DataStatus, } from '@dashlane/carbon-api-consumers';
import { usePremiumStatus } from './usePremiumStatus';
export function useCapabilities(capabilities: string[]): CarbonEndpointResult<boolean> {
    const premiumStatus = usePremiumStatus();
    if (premiumStatus.status !== DataStatus.Success || !premiumStatus.data) {
        return {
            status: DataStatus.Loading,
        };
    }
    return {
        status: DataStatus.Success,
        data: capabilities.every((capability: string) => premiumStatus.data.capabilities?.[capability].enabled),
    };
}
export function useCapabilitiesEnabled(capabilities: string[]): boolean {
    const capabilitiesRequest = useCapabilities(capabilities);
    return capabilitiesRequest.status === DataStatus.Success
        ? capabilitiesRequest.data
        : false;
}
export function useCapabilitiesDisabled(capabilities: string[]): boolean {
    const capabilitiesRequest = useCapabilities(capabilities);
    return capabilitiesRequest.status === DataStatus.Success
        ? !capabilitiesRequest.data
        : false;
}
