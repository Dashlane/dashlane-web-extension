import { PublicKeyCredentialCreationOptionsJSON, PublicKeyCredentialEnableOptionsJSON, WebAuthnCallTypes, } from '@dashlane/communication';
import { EnableWebAuthnAuthenticationResult } from './types';
import { carbonConnector } from 'libs/carbon/connector';
import { startAttestation } from 'webapp/webauthn/helpers/credential';
import { isRoamingCredential } from 'webapp/webauthn/helpers/browserWebAuthnAuthentication';
export const enableWebAuthnAuthenticationWithAttestation = async (publicKeyJSON: PublicKeyCredentialEnableOptionsJSON): Promise<EnableWebAuthnAuthenticationResult> => {
    const credential = await startAttestation(publicKeyJSON as PublicKeyCredentialCreationOptionsJSON);
    const isRoaming = isRoamingCredential();
    const authenticationType = WebAuthnCallTypes.CREATE;
    const result = await carbonConnector.enableWebAuthnAuthentication({
        authenticationType,
        credential,
        isRoaming,
    });
    return {
        success: result.success,
        data: {
            authenticationType,
            isRoaming,
        },
    };
};
