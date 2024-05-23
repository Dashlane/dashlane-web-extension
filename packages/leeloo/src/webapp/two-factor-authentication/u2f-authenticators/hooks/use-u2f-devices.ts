import { DataStatus, useCarbonEndpoint } from '@dashlane/carbon-api-consumers';
import type { U2FDevice } from '@dashlane/communication';
import { carbonConnector } from 'libs/carbon/connector';
export const useU2FDevices = (): U2FDevice[] => {
    const u2fDevices = useCarbonEndpoint({
        queryConfig: {
            query: carbonConnector.getU2FDevicesList,
        },
        liveConfig: {
            live: carbonConnector.liveU2FDevicesList,
        },
    }, []);
    if (u2fDevices.status === DataStatus.Success) {
        return u2fDevices.data;
    }
    return [];
};
