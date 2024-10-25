import {
  ACCOUNT_CREATION_STARTED,
  AccountKeyState,
  SAVE_ACCOUNT_KEYS,
  SAVE_ACCOUNT_SETTINGS,
  SettingsState,
} from "Session/Store/account-creation/actions";
import { Action } from "Store";
import {
  getEmptyPersonalSettings,
  getUpdatedPersonalSettings,
} from "Session/Store/personalSettings";
export interface AccountCreation {
  settings: SettingsState;
  accountKey: AccountKeyState;
  isSSO: boolean;
}
export default (state = getEmptyAccountCreation(), action: Action) => {
  switch (action.type) {
    case SAVE_ACCOUNT_SETTINGS:
      return {
        ...state,
        settings: {
          ...action.settings,
          personalSettings: getUpdatedPersonalSettings(
            state.settings.personalSettings,
            action.settings.personalSettings
          ),
        },
      };
    case SAVE_ACCOUNT_KEYS:
      return {
        ...state,
        accountKey: action.accountKey,
      };
    case ACCOUNT_CREATION_STARTED:
      const emptyState = getEmptyAccountCreation();
      return {
        ...emptyState,
        isSSO: action.isSSO,
      };
    default:
      return state;
  }
};
export function getEmptyAccountCreation(): AccountCreation {
  return {
    settings: {
      personalSettings: getEmptyPersonalSettings(),
      promise: null,
    },
    accountKey: {
      promise: null,
    },
    isSSO: false,
  };
}
