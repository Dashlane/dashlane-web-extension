import * as cookie from 'cookie';
import createReducer from 'store/reducers/create';
import { GlobalState } from 'store/types';
import State, { makeEmptyLogs } from './types';
import { v4 as uuid } from 'uuid';
const desktopAnonymousComputerId = (): string => {
    const cookies = cookie.parse(document.cookie);
    return cookies['anonid'];
};
const websiteTrackingId = (): string => {
    try {
        const cookies = cookie.parse(document.cookie);
        return JSON.parse(cookies['userFunnelCookie']).trackingId;
    }
    catch (e) {
        return '';
    }
};
export default createReducer<State>('LOG', {
    ...makeEmptyLogs(),
    flushLogsRequested: false,
    desktopAnonymousComputerId: desktopAnonymousComputerId(),
    device: uuid(),
    websiteTrackingId: websiteTrackingId(),
    userAgent: window.navigator.userAgent,
});
export function intentReducer(state: GlobalState, param: {
    kind: string;
    details: any;
}) {
    state.logs[param.kind].push(param.details);
    return state;
}
