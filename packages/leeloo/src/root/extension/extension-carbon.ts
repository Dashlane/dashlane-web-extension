import { Store } from "../../store/create";
import { carbonConnector } from "../../libs/carbon/connector";
import {
  loadedLocalAccountListAFirstTime,
  localAccountsListUpdated,
  noSessionToResume,
} from "../../libs/carbon/reducer";
export const resumeSession = (store: Store): Promise<void> =>
  carbonConnector.resumeSession({}).then((isSessionToResume) => {
    if (!isSessionToResume) {
      store.dispatch(noSessionToResume());
    }
  });
export const loadLocalAccounts = (store: Store): Promise<void> =>
  carbonConnector.getLocalAccountsList(null).then(({ localAccounts }) => {
    store.dispatch(loadedLocalAccountListAFirstTime());
    store.dispatch(localAccountsListUpdated(localAccounts));
  });
export const attemptToOpenExtensionSession = (store: Store): Promise<void> => {
  loadLocalAccounts(store);
  return resumeSession(store);
};
