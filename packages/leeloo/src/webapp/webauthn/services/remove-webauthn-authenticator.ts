import { carbonConnector } from 'libs/carbon/connector';
export const removeWebAuthnAuthenticator = async (credentialId: string) => {
    return await carbonConnector.removeWebAuthnAuthenticator({
        credentialId,
    });
};
