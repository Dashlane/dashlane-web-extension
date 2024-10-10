import {
  CommonApplicationSettings,
  UsersPublicSettingsStore,
} from "Application/ApplicationSettings";
import {
  ApplicationSettingsActionTypes,
  DELETE_USER_PUBLIC_SETTINGS,
  STORE_APPLICATION_SETTINGS,
  STORE_USER_PUBLIC_SETTING,
} from "Application/Store/applicationSettings/actions";
export interface SyncApplicationSettings {
  syncWithLocalClients?: boolean;
}
const getEmptySyncApplicationSettings = () => {
  return {
    syncWithLocalClients: false,
  };
};
export interface ApplicationSettings {
  sync?: SyncApplicationSettings;
  userABTestNames?: string[];
  migratedToSAEX?: boolean;
  desktopLogin?: string;
  publicUsersSettings: UsersPublicSettingsStore;
  commonApplicationSettings: CommonApplicationSettings;
}
export const getEmptyApplicationSettings = (): ApplicationSettings => {
  return {
    sync: getEmptySyncApplicationSettings(),
    userABTestNames: [],
    migratedToSAEX: undefined,
    desktopLogin: undefined,
    publicUsersSettings: undefined,
    commonApplicationSettings: undefined,
  };
};
export default (
  state = getEmptyApplicationSettings(),
  action: ApplicationSettingsActionTypes
): ApplicationSettings => {
  switch (action.type) {
    case STORE_APPLICATION_SETTINGS:
      return { ...state, ...(action.settings || {}) };
    case STORE_USER_PUBLIC_SETTING: {
      const login = action.login;
      const currentUserPublicSettings = state.publicUsersSettings ?? {};
      const publicUsersSettings = {
        ...currentUserPublicSettings,
        [login]: {
          ...(currentUserPublicSettings[login] ?? {}),
          ...action.userSettings,
        },
      };
      return {
        ...state,
        publicUsersSettings,
      };
    }
    case DELETE_USER_PUBLIC_SETTINGS: {
      const logins = action.logins;
      const loginsWithSettings = Object.keys(state.publicUsersSettings ?? {});
      const entriesToDelete = logins.filter((login) =>
        loginsWithSettings.includes(login.trim())
      );
      if (entriesToDelete.length === 0) {
        return { ...state };
      }
      entriesToDelete.forEach((login) => {
        const loginToDelete = login.trim();
        delete state.publicUsersSettings[loginToDelete];
      });
      return { ...state };
    }
    default:
      return state;
  }
};
