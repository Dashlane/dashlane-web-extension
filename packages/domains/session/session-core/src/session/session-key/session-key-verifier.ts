import { Injectable } from '@dashlane/framework-application';
import { FlexibleSignatureVerifier } from '@dashlane/framework-dashlane-application';
import { base64ToArrayBuffer, concatBuffers, textToArrayBuffer, } from '@dashlane/framework-encoding';
import { assertUnreachable } from '@dashlane/framework-types';
import { SessionKey } from '../stores/session-state.types';
@Injectable()
export class SessionKeyVerifier {
    public constructor(private flexibleVerifier: FlexibleSignatureVerifier) { }
    public verify(encryptedLk: ArrayBuffer, sessionKey: SessionKey): Promise<boolean> {
        const { flexibleVerifier } = this;
        let encryptionKey: ArrayBuffer;
        switch (sessionKey.type) {
            case 'sso':
                encryptionKey = base64ToArrayBuffer(sessionKey.ssoKey);
                break;
            case 'mp':
                encryptionKey = concatBuffers(textToArrayBuffer(sessionKey.masterPassword), base64ToArrayBuffer(sessionKey.secondaryKey ?? ''));
                break;
            default:
                assertUnreachable(sessionKey);
        }
        return flexibleVerifier.verifySignature(encryptionKey, encryptedLk);
    }
}
