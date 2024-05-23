import reducer from './reducer';
import State, { makeEmptyLogs, WebsiteLogEntry } from './types';
export const sendInitiated = reducer.registerAction<void>('SEND', (state: State) => Object.assign({}, state, makeEmptyLogs()));
export const sendWebsiteFailure = reducer.registerAction('SEND_WEBSITE_FAILURE', (state: State, failedEntries: WebsiteLogEntry[]) => Object.assign({}, state, {
    website: state.website.concat(failedEntries),
}));
