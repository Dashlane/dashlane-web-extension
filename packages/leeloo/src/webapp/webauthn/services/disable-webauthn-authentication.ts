import { carbonConnector } from 'libs/carbon/connector';
export const disableWebAuthnAuthentication = async () => {
    const disableResult = await carbonConnector.disableWebAuthnAuthentication();
    return disableResult;
};
