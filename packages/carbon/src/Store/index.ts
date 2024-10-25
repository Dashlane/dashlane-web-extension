import * as Redux from "redux";
import { persistStore } from "redux-persist";
import { BehaviorSubject } from "rxjs";
import { Notifications, PersonalSettings, PlatformInfo, SyncState, } from "@dashlane/communication";
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
    ***: () => ABTesting;
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
type StoreServicePersistenceMembers = Pick<StoreService, "flush" | "completeRehydration">;
const setupSessionPersistence = (store: Redux.Store<State>, sessionStorage?: AppSessionStorage): StoreServicePersistenceMembers => {
    if (sessionStorage) {
        let rehydrationCallback = () => { };
        const rehydrationPromise = new Promise<void>((resolve) => {
            rehydrationCallback = () => {
                console.log("[background/carbon] StoreSession init: rehydration from session storage done");
                resolve();
            };
        });
        console.log("[background/carbon] StoreSession init: session storage enabled");
        const persistor = persistStore(store, null, rehydrationCallback);
        return {
            completeRehydration: () => rehydrationPromise,
            flush: () => persistor.flush(),
        };
    }
    else {
        console.log("[background/carbon] StoreSession init: no session storage");
        return {
            completeRehydration: () => Promise.resolve(),
            flush: () => Promise.resolve(),
        };
    }
};
export { Action, State } from "Store/types";
