import { CarbonEndpointResult, useCarbonEndpoint, } from '@dashlane/carbon-api-consumers';
import { carbonConnector } from 'libs/carbon/connector';
export function useAdminRecoveryOptInSetting(): CarbonEndpointResult<boolean> {
    return useCarbonEndpoint({
        queryConfig: {
            query: carbonConnector.getRecoveryOptInSetting,
        },
    }, []);
}
