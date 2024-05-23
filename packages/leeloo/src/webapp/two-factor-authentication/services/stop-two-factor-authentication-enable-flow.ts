import { carbonConnector } from 'libs/carbon/connector';
export const stopTwoFactorAuthenticationEnableFlow = async () => {
    const result = await carbonConnector.stopTwoFactorAuthenticationEnableFlow(null);
    return result;
};
