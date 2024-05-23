import { useCarbonEndpoint } from '@dashlane/carbon-api-consumers';
import { carbonConnector } from 'src/carbonConnector';
export const useIsBrazeContentDisabled = () => useCarbonEndpoint({
    queryConfig: {
        query: carbonConnector.getIsBrazeContentDisabled,
    },
    liveConfig: {
        live: carbonConnector.liveIsBrazeContentDisabled,
    },
}, []);
