import { UseCaseScope } from '@dashlane/framework-contracts';
import { defineStore, StoreCapacity } from '@dashlane/framework-application';
import { Mutex } from 'async-mutex';
import { PersistedSessionsState, SessionsState } from './session-state.types';
import { SessionStoreCodec } from './session-store-codec';
export class SessionsStateStore extends defineStore<SessionsState, PersistedSessionsState>({
    storeName: 'sessions-state-store',
    scope: UseCaseScope.Device,
    capacity: StoreCapacity._010KB,
    persist: true,
    isCache: true,
    codec: SessionStoreCodec,
    storage: {
        initialValue: {},
        schemaVersion: 2,
        typeGuard: (x: unknown): x is PersistedSessionsState => true,
        migrateStorageSchema: () => ({}),
    },
}) {
}
export const SessionStoreMutex = new Mutex();
