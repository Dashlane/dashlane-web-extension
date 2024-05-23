import { useCarbonEndpoint } from '@dashlane/carbon-api-consumers';
import { carbonConnector } from 'src/carbonConnector';
export function usePaymentFailureChurningData() {
    return useCarbonEndpoint({
        queryConfig: {
            query: carbonConnector.getIsPaymentFailureChurningDismissed,
        },
    }, []);
}
