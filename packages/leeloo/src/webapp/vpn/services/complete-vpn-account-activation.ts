import { carbonConnector } from 'libs/carbon/connector';
export const completeVpnAccountActivation = async () => {
    return await carbonConnector.completeVpnAccountActivation();
};
