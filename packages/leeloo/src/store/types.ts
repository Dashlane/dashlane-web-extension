import { Cursor as ReduxCursor } from 'redux-cursor';
import { State as CarbonState } from 'libs/carbon/types';
import Logs from 'libs/logs/types';
import Notifications from 'libs/notifications/types';
import Locale from 'libs/i18n/types';
import User from 'user/types';
import { State as WebAppState } from 'libs/webapp/types';
import { State as DialogSate } from 'libs/dialog/types';
import { State as AfterLoginRedirectState } from 'libs/redirect/after-login/state';
import { State as DirectorySyncState } from 'team/directory-sync-key/state';
import { State as IeNotificationState } from 'team/ie-drop-notification/types';
import { State as InitialSyncProgressState } from 'auth/initial-sync-progress/types';
export interface Action {
    type: string;
}
export type Cursor<LocalState extends Record<string, any>> = ReduxCursor<LocalState, GlobalState>;
export interface GlobalState {
    initialSyncProgress: InitialSyncProgressState;
    notifications: Notifications;
    carbon: CarbonState;
    cursor: {};
    directorySyncKey: DirectorySyncState;
    locale: Locale;
    logs: Logs;
    afterLogin: AfterLoginRedirectState;
    user: User;
    webapp: WebAppState;
    dialog: DialogSate;
    ieNotifications: IeNotificationState;
}
export type DispatchGlobal = (action: {
    type: string;
}) => void;
