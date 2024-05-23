import { CarbonEndpointResult, useCarbonEndpoint, } from '@dashlane/carbon-api-consumers';
import { carbonConnector } from 'libs/carbon/connector';
export const useProtectPasswordsSetting = (): CarbonEndpointResult<boolean> => useCarbonEndpoint({
    queryConfig: {
        query: carbonConnector.arePasswordsProtected,
    },
    liveConfig: {
        live: carbonConnector.liveArePasswordsProtected,
    },
}, []);
