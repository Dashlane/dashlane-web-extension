import { getExtensionId } from 'libs/extension';
import { carbonConnector } from 'libs/carbon/connector';
export const initOpenSessionWithWebAuthnAuthenticator = async (login: string) => {
    const relyingPartyId = getExtensionId();
    if (!relyingPartyId) {
        throw new Error('WebAuthn Authentication init Open Session cannot be started as extension Id is missing');
    }
    const initOpenSession = await carbonConnector.initOpenSessionWithWebAuthnAuthenticator({
        relyingPartyId,
        login,
    });
    if (!initOpenSession.success) {
        throw new Error('WebAuthn Authentication Open Session cannot be completed as init was not possible');
    }
    return initOpenSession;
};
