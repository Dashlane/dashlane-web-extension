import { DataStatus, useCarbonEndpoint } from '@dashlane/carbon-api-consumers';
import { LoginDeviceLimitFlowView } from '@dashlane/communication';
import { carbonConnector } from 'src/carbonConnector';
export function useLoginDeviceLimitFlow(): LoginDeviceLimitFlowView | null | undefined {
    const endpointResult = useCarbonEndpoint({
        queryConfig: {
            query: carbonConnector.getLoginDeviceLimitFlow,
        },
        liveConfig: {
            live: carbonConnector.liveLoginDeviceLimitFlow,
        },
    }, []);
    if (endpointResult.status !== DataStatus.Success) {
        return undefined;
    }
    return endpointResult.data;
}
