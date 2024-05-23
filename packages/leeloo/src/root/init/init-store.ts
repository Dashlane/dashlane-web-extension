import { Store as ReduxStore } from 'redux';
import appReducer from 'app/reducer';
import createStore from 'store/create';
let store: ReduxStore;
export function initStore() {
    if (!store) {
        store = createStore(appReducer);
    }
    return store;
}
