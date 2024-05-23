import { CarbonEndpointResult, useCarbonEndpoint, } from '@dashlane/carbon-api-consumers';
import { CredentialSearchOrder } from '@dashlane/communication';
import { carbonConnector } from 'src/carbonConnector';
export function useCredentialSearchOrder(): CarbonEndpointResult<CredentialSearchOrder> {
    return useCarbonEndpoint({
        queryConfig: {
            query: carbonConnector.getCredentialSearchOrder,
        },
    }, []);
}
