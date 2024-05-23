import { carbonConnector } from 'libs/carbon/connector';
export const startTwoFactorAuthenticationDisableFlow = async () => {
    const result = await carbonConnector.startTwoFactorAuthenticationDisableFlow(null);
    return result;
};
