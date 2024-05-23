import { useCarbonEndpoint } from '@dashlane/carbon-api-consumers';
import { carbonConnector } from 'src/carbonConnector';
export const usePublicUserId = () => useCarbonEndpoint({
    queryConfig: {
        query: carbonConnector.getPublicUserId,
    },
}, []);
