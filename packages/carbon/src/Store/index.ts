import * as Redux from "redux";
import { persistStore } from "redux-persist";
import { BehaviorSubject } from "rxjs";
import {
  Notifications,
  PersonalSettings,
  PlatformInfo,
  SyncState,
} from "@dashlane/communication";
import { Account as AccountInfo } from "Session/Store/account";
import { PersonalData } from "Session/Store/personalData/types";
import { LocalSettings } from "Session/Store/localSettings/types";
import { SpaceData } from "Session/Store/spaceData/index";
import { SharingData } from "Session/Store/sharingData/types";
import { TeamAdminData } from "Session/Store/teamAdminData/index";
import { Session } from "Session/Store/session";
import { SdkAuthentication } from "Session/Store/sdk/types";
import { Location, Platform } from "Session/Store/platform/index";
import { AccountCreation } from "Session/Store/account-creation/";
import { ABTesting } from "ABTests/Store/abtesting";
import { AppSessionStorage, State } from "Store/types";
import { createStore } from "Store/store";
export interface Options {
  sessionStorage?: AppSessionStorage;
  store?: Redux.Store<State>;
}
export interface StoreService {
  dispatch: <A extends Redux.Action>(action: A) => A;
  completeRehydration: () => Promise<void>;
  flush: () => Promise<void>;
  getABTesting: () => ABTesting;
  getAccountCreation: () => AccountCreation;
  getAccountInfo: () => AccountInfo;
  getLocation: () => Location;
  getSdkAuthentication: () => SdkAuthentication;
  getLocalSettings: () => LocalSettings;
  getPersonalData: () => PersonalData;
  getNotificationStatus: () => Notifications;
  getPersonalSettings: () => PersonalSettings;
  getPlatform: () => Platform;
  getPlatformInfo: () => PlatformInfo;
  getSharingData: () => SharingData;
  getSpaceData: () => SpaceData;
  getState$: () => BehaviorSubject<State>;
  getState: () => Readonly<State>;
  getStore: () => Redux.Store<State>;
  getSyncStatus: () => SyncState;
  getTeamAdminData: () => TeamAdminData;
  getUserLogin: () => string;
  getUserSession: () => Session;
  isAuthenticated: () => boolean;
  hasSessionId: () => boolean;
}
type StoreServicePersistenceMembers = Pick<
  StoreService,
  "flush" | "completeRehydration"
>;
const setupSessionPersistence = (
  store: Redux.Store<State>,
  sessionStorage?: AppSessionStorage
): StoreServicePersistenceMembers => {
  if (sessionStorage) {
    let rehydrationCallback = () => {};
    const rehydrationPromise = new Promise<void>((resolve) => {
      rehydrationCallback = () => {
        console.log(
          "[background/carbon] StoreSession init: rehydration from session storage done"
        );
        resolve();
      };
    });
    console.log(
      "[background/carbon] StoreSession init: session storage enabled"
    );
    const persistor = persistStore(store, null, rehydrationCallback);
    return {
      completeRehydration: () => rehydrationPromise,
      flush: () => persistor.flush(),
    };
  } else {
    console.log("[background/carbon] StoreSession init: no session storage");
    return {
      completeRehydration: () => Promise.resolve(),
      flush: () => Promise.resolve(),
    };
  }
};
export const makeStoreService = (options?: Options): StoreService => {
  const sessionStorage = options?.sessionStorage;
  const store = options?.store || createStore(sessionStorage);
  const persistedStoreApi = setupSessionPersistence(store, sessionStorage);
  const getState = () => store.getState();
  const state$ = new BehaviorSubject(getState());
  store.subscribe(() => state$.next(getState()));
  return {
    ...persistedStoreApi,
    dispatch: <A extends Redux.Action>(action: A) => store.dispatch(action),
    getABTesting: () => getState().device.abtesting,
    getAccountInfo: () => getState().userSession.account,
    getAccountCreation: () => getState().userSession.accountCreation,
    getLocation: () => getState().device.platform.location,
    getSdkAuthentication: () => getState().userSession.sdkAuthentication,
    getLocalSettings: () => getState().userSession.localSettings,
    getPersonalData: () => getState().userSession.personalData,
    getPersonalSettings: () => getState().userSession.personalSettings,
    getNotificationStatus: () => getState().userSession.notificationsStatus,
    getPlatform: () => getState().device.platform,
    getPlatformInfo: () => getState().device.platform.info,
    getSharingData: () => getState().userSession.sharingData,
    getSpaceData: () => getState().userSession.spaceData,
    getState$: () => state$,
    getState: () => getState(),
    getStore: () => store,
    getSyncStatus: () => getState().userSession.sync,
    getTeamAdminData: () => getState().userSession.teamAdminData,
    getUserLogin: () => getState().userSession.account.login,
    getUserSession: () => getState().userSession.session,
    isAuthenticated: () =>
      Boolean(
        getState().userSession.session.sessionId &&
          getState().userSession.account.isAuthenticated
      ),
    hasSessionId: () => Boolean(getState().userSession.session.sessionId),
  };
};
export { Action, State } from "Store/types";
