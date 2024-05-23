import { InitOpenSessionWithWebAuthnAuthenticatorsInfo } from '@dashlane/communication';
import { carbonConnector } from 'libs/carbon/connector';
import { getExtensionId } from 'libs/extension';
import { startAssertion } from 'webapp/webauthn';
export const triggerWebAuthn = async (loginEmail: string, authAbortSignal: AbortSignal) => {
    try {
        const relyingPartyId = getExtensionId();
        if (!relyingPartyId) {
            return {
                success: false,
                error: new Error('WebAuthn Authentication init Open Session cannot be started as extension Id is missing'),
            };
        }
        const initOpenSessionResult = await carbonConnector.initOpenSessionWithWebAuthnAuthenticator({
            relyingPartyId,
            login: loginEmail,
        });
        if (!initOpenSessionResult.success) {
            return {
                success: false,
                error: initOpenSessionResult.error.code,
            };
        }
        const { publicKeyOptions } = initOpenSessionResult.response;
        const credential = await startAssertion(publicKeyOptions, authAbortSignal);
        const authenticator = initOpenSessionResult.response.authenticatorsInfo.find((authenticatorInfo: InitOpenSessionWithWebAuthnAuthenticatorsInfo) => {
            return authenticatorInfo.credentialId === credential.id;
        });
        const openSessionWithWebAuthnResult = await carbonConnector.openSessionWithWebAuthnAuthenticator({
            credential,
            login: loginEmail,
            isRoamingAuthenticator: authenticator?.isRoaming,
        });
        if (!openSessionWithWebAuthnResult.success) {
            return {
                success: false,
                error: openSessionWithWebAuthnResult.error.code,
            };
        }
        return openSessionWithWebAuthnResult;
    }
    catch (error) {
        return {
            success: false,
            error: error,
        };
    }
};
