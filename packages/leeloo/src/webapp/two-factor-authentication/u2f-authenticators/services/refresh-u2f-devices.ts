import { carbonConnector } from 'libs/carbon/connector';
export const refreshU2FDevices = async () => {
    const result = await carbonConnector.refreshU2FDevicesList();
    return result;
};
