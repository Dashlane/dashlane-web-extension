import { UseCaseScope } from '@dashlane/framework-contracts';
import { defineStore, StoreCapacity } from '@dashlane/framework-application';
import { PassthroughCodec } from '@dashlane/framework-services';
import { CryptoDerivationConfig } from '../crypto-config/types';
export interface CryptoSettings {
    derivation: CryptoDerivationConfig;
    salt: string;
}
export interface SessionsCryptoSettingsState {
    [login: string]: CryptoSettings;
}
export const isSessionsCryptoSettingsState = (x: unknown): x is SessionsCryptoSettingsState => {
    if (!x || !(typeof x === 'object')) {
        return false;
    }
    if (Object.keys(x).length === 0) {
        return true;
    }
    return Object.entries(x).every(([, entry]) => {
        return (typeof entry === 'object' && 'derivation' in entry && 'salt' in entry);
    });
};
export class SessionsCryptoSettingsStore extends defineStore<SessionsCryptoSettingsState, SessionsCryptoSettingsState>({
    storeName: 'sessions-crypto-settings-store',
    scope: UseCaseScope.Device,
    capacity: StoreCapacity._010KB,
    persist: true,
    storage: {
        schemaVersion: 1,
        initialValue: {},
        typeGuard: isSessionsCryptoSettingsState,
    },
    codec: PassthroughCodec,
}) {
}
