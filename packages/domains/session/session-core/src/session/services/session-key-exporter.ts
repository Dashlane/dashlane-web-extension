import { SessionKey } from '../stores/session-state.types';
import { arrayBufferToBase64 } from '@dashlane/framework-encoding';
import { Injectable } from '@dashlane/framework-application';
import { FlexibleEncryptor } from '@dashlane/framework-dashlane-application';
import { DEFAULT_CBCHMAC64_CIPHER_CONFIG, DEFAULT_NODERIVATION_CONFIG, } from '@dashlane/framework-services';
import { ExportedSessionKeyCryptoManager } from './exported-session-key-crypto-manager';
import { firstValueFrom } from 'rxjs';
import { ExportedSessionKey } from '@dashlane/session-contracts';
@Injectable()
export class SessionKeyExporter {
    constructor(private readonly cryptoManager: ExportedSessionKeyCryptoManager, private readonly flexibleEncryptor: FlexibleEncryptor) { }
    async export(sessionKey: SessionKey): Promise<ExportedSessionKey> {
        const sessionKeyStr = JSON.stringify(sessionKey);
        const buffer = new TextEncoder().encode(sessionKeyStr);
        const key = await firstValueFrom(this.cryptoManager.getOrCreateEncryptionKey());
        const encryptedBuffer = await this.flexibleEncryptor.encrypt(key, buffer, DEFAULT_NODERIVATION_CONFIG, DEFAULT_CBCHMAC64_CIPHER_CONFIG);
        return Promise.resolve({
            type: 'exported',
            content: arrayBufferToBase64(encryptedBuffer),
        });
    }
}
