import send, { sendImmediately } from "./send";
import { Store } from "../../store/create";
import { getSessionId, getUserId } from "../../user";
import { flushLogsInitiatedAction } from ".";
export default function (store: Store): void {
  store.subscribe(() => {
    const logsState = store.getState().logs;
    if (logsState.flushLogsRequested) {
      sendImmediately(
        store.dispatch,
        getUserId(store),
        getSessionId(store),
        logsState
      );
      store.dispatch(flushLogsInitiatedAction());
      return;
    }
    send(store.dispatch, getUserId(store), getSessionId(store), logsState);
  });
}
