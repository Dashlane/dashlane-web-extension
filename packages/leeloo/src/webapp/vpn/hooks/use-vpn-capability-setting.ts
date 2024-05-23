import { CarbonEndpointResult, DataStatus, useCarbonEndpoint, } from '@dashlane/carbon-api-consumers';
import { VpnCapabilitySetting } from '@dashlane/communication';
import { carbonConnector } from 'libs/carbon/connector';
export const useVpnCapabilitySetting = (): VpnCapabilitySetting | null => {
    const result: CarbonEndpointResult<VpnCapabilitySetting> = useCarbonEndpoint({
        queryConfig: {
            query: carbonConnector.getVpnCapabilitySetting,
        },
    }, []);
    return result.status === DataStatus.Success ? result.data : null;
};
