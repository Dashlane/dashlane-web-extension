import reducers from './reducers';
import { applyMiddleware, compose, Middleware, createStore as reduxCreateStore, Store as ReduxStore, } from 'redux';
import { LocalReducer } from 'redux-cursor';
import { createLogger } from 'redux-logger';
import { LOG_STORE_ACTIONS } from 'root/init/logging';
import { GlobalState } from './types';
export interface Store extends ReduxStore<GlobalState> {
    getState: () => GlobalState;
}
export default function create(rootCursorReducer: LocalReducer<{}>): ReduxStore {
    const middlewares: Middleware[] = [];
    if (LOG_STORE_ACTIONS) {
        middlewares.push(createLogger({
            timestamp: false,
            collapsed: true,
            diff: true,
        }));
    }
    const composedFunction = compose(applyMiddleware(...middlewares), (window as any).devToolsExtension && process.env.NODE_ENV === '*****'
        ? (window as any).devToolsExtension()
        : (f: any) => f) as any;
    const store: ReduxStore<GlobalState> = composedFunction(reduxCreateStore)(reducers(rootCursorReducer)) as any;
    if (module.hot) {
        module.hot.accept('./reducers', () => {
            store.replaceReducer(require('./reducers'));
        });
    }
    return store;
}
