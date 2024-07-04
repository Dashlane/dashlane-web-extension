import { ExportedSessionKey } from '@dashlane/session-contracts';
import { SessionKey } from '../stores/session-state.types';
import { base64ToArrayBuffer } from '@dashlane/framework-encoding';
import { Injectable } from '@dashlane/framework-application';
import { firstValueFrom } from 'rxjs';
import { FlexibleDecryptor } from '@dashlane/framework-dashlane-application';
import { ExportedSessionKeyCryptoManager } from './exported-session-key-crypto-manager';
@Injectable()
export class SessionKeyImporter {
    constructor(private readonly cryptoManager: ExportedSessionKeyCryptoManager, private readonly flexibleDecryptor: FlexibleDecryptor) { }
    async import(exportedSessionKey: ExportedSessionKey): Promise<SessionKey> {
        const key = await firstValueFrom(this.cryptoManager.getOrCreateEncryptionKey());
        const content = await this.flexibleDecryptor.decrypt(key, base64ToArrayBuffer(exportedSessionKey.content));
        const buffer = new TextDecoder().decode(content);
        const sessionKey = JSON.parse(buffer);
        return Promise.resolve(sessionKey);
    }
}
