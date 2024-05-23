import { DataStatus, useCarbonEndpoint } from '@dashlane/carbon-api-consumers';
import { WebOnboardingModeEvent } from '@dashlane/communication';
import { carbonConnector } from 'src/carbonConnector';
export function useWebOnboardingMode(): WebOnboardingModeEvent | null {
    const result = useCarbonEndpoint({
        queryConfig: {
            query: carbonConnector.getWebOnboardingMode,
        },
        liveConfig: {
            live: carbonConnector.liveWebOnboardingMode,
        },
    }, []);
    return result.status === DataStatus.Success ? result.data : null;
}
