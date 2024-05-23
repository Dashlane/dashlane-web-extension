import { useCarbonEndpoint } from '@dashlane/carbon-api-consumers';
import { carbonConnector } from 'libs/carbon/connector';
export const useIdentitiesCount = () => {
    return useCarbonEndpoint({
        queryConfig: {
            query: carbonConnector.getIdentitiesCount,
        },
        liveConfig: {
            live: carbonConnector.liveIdentitiesCount,
        },
    }, []);
};
