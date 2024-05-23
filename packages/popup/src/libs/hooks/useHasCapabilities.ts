import { CarbonEndpointResult, DataStatus, } from '@dashlane/carbon-api-consumers';
import { usePremiumStatusData } from 'libs/api';
export function useHasCapabilities(capabilities: string[]): CarbonEndpointResult<boolean> {
    const premiumStatus = usePremiumStatusData();
    if (premiumStatus.status === DataStatus.Error) {
        return {
            status: DataStatus.Error,
            error: premiumStatus.error,
        };
    }
    if (premiumStatus.status === DataStatus.Loading) {
        return {
            status: DataStatus.Loading,
        };
    }
    const premiumCapabilities = premiumStatus.data.capabilities;
    return {
        status: DataStatus.Success,
        data: !!premiumCapabilities &&
            capabilities.every((capability: string) => !!premiumCapabilities[capability]),
    };
}
