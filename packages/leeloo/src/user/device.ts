import { Store } from 'store/create';
import loadAndPersist from './storage';
export function loadAndPersistDevice(store: Store) {
    return Promise.all([
        loadAndPersist({
            store,
            storage: localStorage,
            whiteList: [
                'locale/language',
                'locale/country',
            ],
        }),
    ]);
}
