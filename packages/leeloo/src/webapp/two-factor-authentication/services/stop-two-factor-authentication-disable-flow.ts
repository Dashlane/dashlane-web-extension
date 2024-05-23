import { carbonConnector } from 'libs/carbon/connector';
export const stopTwoFactorAuthenticationDisableFlow = async () => {
    const result = await carbonConnector.stopTwoFactorAuthenticationDisableFlow(null);
    return result;
};
