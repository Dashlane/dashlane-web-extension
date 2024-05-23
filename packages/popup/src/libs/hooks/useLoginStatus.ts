import { CarbonEndpointResult, useCarbonEndpoint, } from '@dashlane/carbon-api-consumers';
import { GetLoginStatus } from '@dashlane/communication';
import { carbonConnector } from 'src/carbonConnector';
export function useLoginStatus(): CarbonEndpointResult<GetLoginStatus> {
    return useCarbonEndpoint({
        queryConfig: {
            query: carbonConnector.getUserLoginStatus,
        },
        liveConfig: {
            live: carbonConnector.liveLoginStatus,
        },
    }, []);
}
