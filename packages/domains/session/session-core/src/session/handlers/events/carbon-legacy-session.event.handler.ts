import { firstValueFrom } from 'rxjs';
import { EventHandler, IEventHandler } from '@dashlane/framework-application';
import { CarbonLegacyClient, CarbonLegacyEvent, LoginStatusChanged, UserCryptoSettings, } from '@dashlane/communication';
import { isSuccess } from '@dashlane/framework-types';
import { SessionCloseMode } from '@dashlane/session-contracts';
import { DEFAULT_FLEXIBLE_ARGON2D_DERIVATION_CONFIG } from '@dashlane/framework-services';
import { RandomValuesGetter } from '@dashlane/framework-dashlane-application';
import { SessionsCryptoSettingsStore } from '../../stores/sessions-crypto-settings.store';
import { SessionEventEmitter } from '../../event-emiter';
import { makeDerivationConfig } from '../../crypto-config/helpers';
import { arrayBufferToBase64, base64ToArrayBuffer, } from '@dashlane/framework-encoding';
import { SessionKeyEncryptor } from '../../session-key';
import { SessionKey, SessionState } from '../../stores/session-state.types';
import { SessionsStateStore, SessionStoreMutex, } from '../../stores/sessions-state.store';
import { LocalDataKeyRepository } from '../../local-data-key/local-data-key-repository';
import { SessionKeyCryptoSettingsRepository } from '../../session-key/session-key-crypto-repository';
import { RequestContextClient } from '@dashlane/framework-contracts';
@EventHandler(CarbonLegacyEvent)
export class CarbonLegacySessionEventHandler implements IEventHandler<CarbonLegacyEvent> {
    constructor(private carbon: CarbonLegacyClient, private sessionsStateStore: SessionsStateStore, private sessionsCryptoSettingsStore: SessionsCryptoSettingsStore, private eventEmitter: SessionEventEmitter, private randomValuesGetter: RandomValuesGetter, private localKeyRepo: LocalDataKeyRepository, private encryptor: SessionKeyEncryptor, private settings: SessionKeyCryptoSettingsRepository, private context: RequestContextClient) { }
    async getUserCryptoSettings(): Promise<UserCryptoSettings> {
        const { getUserCryptoSettings } = this.carbon.queries;
        const userCryptoSettings = await firstValueFrom(getUserCryptoSettings());
        if (!isSuccess(userCryptoSettings)) {
            throw new Error('Fail to fetch crypto settings from carbon');
        }
        const { cryptoUserPayload, cryptoFixedSalt: carbonFixedSalt } = userCryptoSettings.data;
        return {
            cryptoUserPayload: cryptoUserPayload,
            cryptoFixedSalt: carbonFixedSalt,
        };
    }
    async getSessionKey(needsSsoMigration: boolean): Promise<SessionKey> {
        const { getMasterPasswordAndServerKey, getIsSSOUser } = this.carbon.queries;
        const isSso = await firstValueFrom(getIsSSOUser());
        if (!isSuccess(isSso)) {
            throw new Error('Fail to fetch is sso user from carbon');
        }
        if (isSso.data || needsSsoMigration) {
            return {
                type: 'sso',
                ssoKey: '',
            };
        }
        const sessionKey = await firstValueFrom(getMasterPasswordAndServerKey());
        if (!isSuccess(sessionKey)) {
            throw new Error('Fail to fetch master password and server key from carbon');
        }
        const { password, serverKey } = sessionKey.data;
        return {
            type: 'mp',
            masterPassword: password,
            secondaryKey: serverKey,
        };
    }
    async handleLogin(login: string, needsSsoMigration: boolean) {
        await SessionStoreMutex.runExclusive(async () => {
            const { cryptoUserPayload, cryptoFixedSalt } = await this.getUserCryptoSettings();
            const derivation = cryptoUserPayload
                ? makeDerivationConfig(cryptoUserPayload)
                : DEFAULT_FLEXIBLE_ARGON2D_DERIVATION_CONFIG;
            const salt = cryptoFixedSalt
                ? cryptoFixedSalt
                : arrayBufferToBase64(this.randomValuesGetter.get(derivation.saltLength));
            const sessionsCryptoSettingsStore = await this.sessionsCryptoSettingsStore.getState();
            this.sessionsCryptoSettingsStore.set({
                ...sessionsCryptoSettingsStore,
                [login]: {
                    derivation,
                    salt,
                },
            });
            const sessionKey = await this.getSessionKey(needsSsoMigration);
            const sessionsStateStore = await this.sessionsStateStore.getState();
            const localKey = await this.localKeyRepo.generate();
            if (!(login in sessionsStateStore)) {
                const state: SessionState = {
                    status: 'open',
                    sessionKey,
                    localKey: localKey ? arrayBufferToBase64(localKey) : null,
                };
                await this.sessionsStateStore.set({
                    ...sessionsStateStore,
                    [login]: state,
                });
            }
            else {
                await this.sessionsStateStore.set({
                    ...sessionsStateStore,
                    [login]: {
                        status: 'open',
                        sessionKey: sessionKey,
                        localKey: localKey ? arrayBufferToBase64(localKey) : null,
                    },
                });
            }
        });
        await this.context.commands.setActiveUser({
            userName: login,
        });
        await this.eventEmitter.sendEvent('sessionOpening', undefined);
        await this.eventEmitter.sendEvent('sessionOpened', undefined);
    }
    async handleLogout() {
        const closedSessions = new Array<string>();
        await SessionStoreMutex.runExclusive(async () => {
            const oldSssionsState = await this.sessionsStateStore.getState();
            const newState: typeof oldSssionsState = {};
            for (const [login, existing] of Object.entries(oldSssionsState)) {
                if (existing.status === 'closed') {
                    newState[login] = existing;
                    continue;
                }
                if (existing.sessionKey.type === 'sso') {
                    closedSessions.push(login);
                    continue;
                }
                const settingsQuery = await firstValueFrom(this.settings.getConfig(login));
                if (!isSuccess(settingsQuery)) {
                    throw new Error('Fail to get crypto settings');
                }
                const settings = settingsQuery.data;
                const encryptedLocalKey = existing.localKey
                    ? arrayBufferToBase64(await this.encryptor.encrypt(base64ToArrayBuffer(existing.localKey), existing.sessionKey, settings))
                    : null;
                newState[login] = {
                    status: 'closed',
                    encryptedLocalKey,
                };
                closedSessions.push(login);
            }
            await this.sessionsStateStore.set(newState);
        });
        for (const login of closedSessions) {
            await this.eventEmitter.sendEvent('sessionClosed', {
                mode: SessionCloseMode.Close,
                email: login,
            });
        }
    }
    async handle(event: CarbonLegacyEvent) {
        if (event.body.eventName === 'loginStatusChanged') {
            const eventData = event.body.eventData as LoginStatusChanged;
            if (eventData.loggedIn) {
                await this.handleLogin(eventData.login, !!eventData.needsSSOMigration);
            }
            else {
                await this.handleLogout();
            }
        }
        if (event.body.eventName === 'openSessionFailed') {
            void this.handleLogout();
        }
    }
}
