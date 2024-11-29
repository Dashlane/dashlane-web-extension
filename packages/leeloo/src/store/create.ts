import reducers from "./reducers";
import {
  applyMiddleware,
  compose,
  Middleware,
  createStore as reduxCreateStore,
  Store as ReduxStore,
} from "redux";
import { LocalReducer } from "redux-cursor";
import { createLogger } from "redux-logger";
import { VERBOSE_LEELOO_LEGACY_LOGGING } from "../root/common/init-logging";
import { GlobalState } from "./types";
export interface Store extends ReduxStore<GlobalState> {
  getState: () => GlobalState;
}
export default function create(
  rootCursorReducer: LocalReducer<{}>
): ReduxStore {
  const middlewares: Middleware[] = [];
  if (VERBOSE_LEELOO_LEGACY_LOGGING) {
    middlewares.push(
      createLogger({
        timestamp: false,
        collapsed: true,
        diff: true,
      })
    );
  }
  const composedFunction = compose(applyMiddleware(...middlewares)) as any;
  const store: ReduxStore<GlobalState> = composedFunction(reduxCreateStore)(
    reducers(rootCursorReducer)
  ) as any;
  return store;
}
