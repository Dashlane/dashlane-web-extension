import { Codec } from '@dashlane/framework-services';
import { PersistedSessionsState, SessionsState } from './session-state.types';
import { Injectable } from '@dashlane/framework-application';
import { SessionKeyEncryptor } from '../session-key';
import { SessionKeyCryptoSettingsRepository } from '../session-key/session-key-crypto-repository';
import { firstValueFrom } from 'rxjs';
import { isSuccess } from '@dashlane/framework-types';
import { arrayBufferToBase64, base64ToArrayBuffer, } from '@dashlane/framework-encoding';
@Injectable()
export class SessionStoreCodec implements Codec<PersistedSessionsState, SessionsState> {
    constructor(private encryptor: SessionKeyEncryptor, private settings: SessionKeyCryptoSettingsRepository) { }
    decode(toDecode: PersistedSessionsState): SessionsState | Promise<SessionsState> {
        const r: SessionsState = {};
        for (const [k, v] of Object.entries(toDecode)) {
            r[k] = {
                status: 'closed',
                encryptedLocalKey: v.encryptedLocalKey,
            };
        }
        return r;
    }
    async encode(toEncode: SessionsState): Promise<PersistedSessionsState> {
        const r: PersistedSessionsState = {};
        for (const [k, v] of Object.entries(toEncode)) {
            if (v.status === 'closed') {
                r[k] = {
                    encryptedLocalKey: v.encryptedLocalKey,
                };
                continue;
            }
            if (v.sessionKey.type === 'sso') {
                continue;
            }
            if (!v.localKey) {
                r[k] = {
                    encryptedLocalKey: null,
                };
                continue;
            }
            const settingsQuery = await firstValueFrom(this.settings.getConfig(k));
            if (!isSuccess(settingsQuery)) {
                throw new Error('Fail to get crypto settings');
            }
            r[k] = {
                encryptedLocalKey: arrayBufferToBase64(await this.encryptor.encrypt(base64ToArrayBuffer(v.localKey), v.sessionKey, settingsQuery.data)),
            };
        }
        return r;
    }
}
