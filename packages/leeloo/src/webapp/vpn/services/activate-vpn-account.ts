import { ActivateVpnAccountRequest } from '@dashlane/communication';
import { carbonConnector } from 'libs/carbon/connector';
export const activateVpnAccount = async (request: ActivateVpnAccountRequest) => {
    return await carbonConnector.activateVpnAccount(request);
};
