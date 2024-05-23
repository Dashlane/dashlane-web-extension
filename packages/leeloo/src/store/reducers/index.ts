import { combineReducers } from 'redux';
import { Action, GlobalState } from 'store/types';
import carbonReducer from 'libs/carbon/reducer';
import NotificationReducer from 'libs/notifications/reducer';
import LogReducer from 'libs/logs/reducer';
import LocaleReducer from 'libs/i18n/reducer';
import UserReducer from 'user/reducer';
import StateInUrlReducer from 'root/stateInUrl/reducer';
import StorageReducer from 'user/storage/reducer';
import WebappReducer from 'libs/webapp/reducer';
import DialogReducer from 'libs/dialog/reducer';
import AfterLoginRedirectReducer from 'libs/redirect/after-login/reducer';
import DirectorySyncKeyReducer from 'team/directory-sync-key/reducer';
import IeNotificationsReducer from 'team/ie-drop-notification/reducer';
import InitialSyncProgressReducer from 'auth/initial-sync-progress/reducer';
import { LocalReducer, makeRootReducer } from 'redux-cursor';
export default function (rootCursorReducer: LocalReducer<{}>) {
    const CursorReducer = makeRootReducer<GlobalState>(rootCursorReducer);
    return function (state: GlobalState, action: Action) {
        state = combineReducers({
            initialSyncProgress: InitialSyncProgressReducer.apply,
            notifications: NotificationReducer.apply,
            carbon: carbonReducer.apply,
            directorySyncKey: DirectorySyncKeyReducer.apply,
            cursor: (s: {} = {}) => s,
            locale: LocaleReducer.apply,
            logs: LogReducer.apply,
            user: UserReducer.apply,
            webapp: WebappReducer.apply,
            dialog: DialogReducer.apply,
            afterLogin: AfterLoginRedirectReducer.apply,
            ieNotifications: IeNotificationsReducer.apply,
        })(state, action) as GlobalState;
        state = CursorReducer(state, action);
        state = StorageReducer(state, action);
        state = StateInUrlReducer(state, action);
        return state;
    };
}
