import { CarbonQueryResult, DataStatus, useCarbonEndpoint, } from '@dashlane/carbon-api-consumers';
import { carbonConnector } from 'src/carbonConnector';
export const useSubscriptionCodeData = (): CarbonQueryResult<string> => useCarbonEndpoint({
    queryConfig: {
        query: carbonConnector.getSubscriptionCode,
    },
    liveConfig: {
        live: carbonConnector.liveSubscriptionCode,
    },
}, []);
export function useSubscriptionCode(): string | null {
    const subscriptionCodeData = useSubscriptionCodeData();
    return subscriptionCodeData.status === DataStatus.Success
        ? subscriptionCodeData.data
        : null;
}
