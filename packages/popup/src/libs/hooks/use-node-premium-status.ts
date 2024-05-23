import { CarbonEndpointResult, useCarbonEndpoint, } from '@dashlane/carbon-api-consumers';
import { NodePremiumStatus } from '@dashlane/communication';
import { carbonConnector } from 'src/carbonConnector';
export function useNodePremiumStatus(): CarbonEndpointResult<NodePremiumStatus> {
    return useCarbonEndpoint({
        queryConfig: {
            query: carbonConnector.getNodePremiumStatus,
        },
    }, []);
}
