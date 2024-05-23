import { carbonConnector } from 'libs/carbon/connector';
export const clearVpnAccountErrors = async () => {
    return await carbonConnector.clearVpnAccountErrors();
};
