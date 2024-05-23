import { CarbonEndpointResult, useCarbonEndpoint, } from '@dashlane/carbon-api-consumers';
import { carbonConnector } from 'libs/carbon/connector';
export const usePublicUserId = (): CarbonEndpointResult<string> => useCarbonEndpoint({
    queryConfig: {
        query: carbonConnector.getPublicUserId,
    },
}, []);
