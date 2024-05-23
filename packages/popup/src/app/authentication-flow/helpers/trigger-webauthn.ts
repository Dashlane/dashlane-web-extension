import type { InitOpenSessionWithWebAuthnAuthenticatorsInfo } from '@dashlane/communication';
import { startAssertion } from 'src/app/login/WebAuthnStep/helpers/credential';
import { carbonConnector } from 'src/carbonConnector';
import { kernel } from 'src/kernel';
export const triggerWebAuthn = async (loginEmail: string, authAbortSignal: AbortSignal) => {
    try {
        const relyingPartyId = kernel.browser.getExtensionId();
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
            error: error as string,
        };
    }
};
