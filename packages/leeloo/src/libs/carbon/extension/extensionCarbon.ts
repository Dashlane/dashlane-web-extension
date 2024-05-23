import { Store } from 'store/create';
import { createEventBus } from 'ts-event-bus';
import WebExtensionChannel from './extensionChannel';
import { carbonEvents, CarbonEvents } from 'libs/carbon/connector/events';
import { carbonConnector } from 'libs/carbon/connector';
import { loadedLocalAccountListAFirstTime, localAccountsListUpdated, noSessionToResume, } from 'libs/carbon/reducer';
export const getExtensionCarbonConnector = (): CarbonEvents => {
    if (!WebExtensionChannel) {
        throw new Error(`App is not packaged in extension, this shouldn't happen`);
    }
    const channels = [WebExtensionChannel];
    const carbonConnector = createEventBus({
        events: carbonEvents,
        channels,
    });
    return carbonConnector;
};
export const resumeSession = (store: Store): Promise<void> => carbonConnector.resumeSession({}).then((isSessionToResume) => {
    if (!isSessionToResume) {
        store.dispatch(noSessionToResume());
    }
});
export const loadLocalAccounts = (store: Store): Promise<void> => carbonConnector.getLocalAccountsList(null).then(({ localAccounts }) => {
    store.dispatch(loadedLocalAccountListAFirstTime());
    store.dispatch(localAccountsListUpdated(localAccounts));
});
export const attemptToOpenExtensionSession = (store: Store): Promise<void> => {
    loadLocalAccounts(store);
    return resumeSession(store);
};
