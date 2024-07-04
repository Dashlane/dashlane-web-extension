import { defineStore, StoreCapacity } from '@dashlane/framework-application';
import { UseCaseScope } from '@dashlane/framework-contracts';
import { PassthroughCodec } from '@dashlane/framework-services';
interface ExportSessionKeyCryptoStoreState {
    encryptionKey?: string;
}
export class ExportSessionKeyCryptoStore extends defineStore<ExportSessionKeyCryptoStoreState, ExportSessionKeyCryptoStoreState>({
    persist: true,
    codec: PassthroughCodec,
    scope: UseCaseScope.Device,
    storage: {
        initialValue: {},
        schemaVersion: 0,
        typeGuard: (value): value is ExportSessionKeyCryptoStoreState => typeof value === 'object' &&
            value !== null &&
            (!('encryptionKey' in value) || typeof value.encryptionKey === 'string'),
    },
    storeName: 'exported-session-keys-crypto',
    capacity: StoreCapacity._001KB,
}) {
}
