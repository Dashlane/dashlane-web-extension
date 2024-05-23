import { useCarbonEndpoint } from '@dashlane/carbon-api-consumers';
import { carbonConnector } from 'src/carbonConnector';
export const useIsAutoSsoLoginDisabled = () => useCarbonEndpoint({
    queryConfig: {
        query: carbonConnector.getIsAutoSSOLoginDisabled,
    },
    liveConfig: {
        live: carbonConnector.liveIsAutoSSOLoginDisabled,
    },
}, []);
