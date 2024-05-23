import { CarbonEndpointResult, useCarbonEndpoint, } from '@dashlane/carbon-api-consumers';
import { carbonConnector } from 'libs/carbon/connector';
export function useAnalyticsInstallationId(): CarbonEndpointResult<string> {
    return useCarbonEndpoint({
        queryConfig: {
            query: carbonConnector.getAnalyticsInstallationId,
        },
    }, []);
}
