import * as Redux from "redux";
import { combineReducers } from "redux";
import { partialRight, pipe } from "ramda";
import { Action } from "Store";
import abTests from "Session/Store/abTests";
import paymentsState from "Session/Store/payments";
import account from "Session/Store/account";
import accountCreation from "Session/Store/account-creation";
import authTicketInfo from "Session/Store/authTicket";
import { credentialOTPs } from "Session/Store/credentialOTP";
import changeMPData from "Session/Store/changeMasterPassword";
import directorySync from "Session/Store/directorySync";
import localSettings from "Session/Store/localSettings";
import {
  loadStoredLocalSettings,
  localSettingsPremiumStatusUpdated,
} from "Session/Store/localSettings/actions";
import {
  addPersonalItemFromTransaction,
  reducer as personalDataReducer,
  removePersonalItemFromTransaction,
} from "Session/Store/personalData";
import personalSettings from "Session/Store/personalSettings";
import sharingData from "Session/Store/sharingData";
import teamAdminData from "Session/Store/teamAdminData";
import spaceData from "Session/Store/spaceData";
import iconsCache from "Session/Store/Icons";
import { spacesUpdated } from "Session/Store/spaceData/actions";
import sync from "Session/Store/sync";
import sharingSync from "Session/Store/sharingSync";
import ssoSettings from "Session/Store/ssoSettings";
import userActivity from "Session/Store/userActivity/reducer";
import vaultReport from "Session/Store/vaultReport/reducer";
import recoveryData from "Session/Store/recovery";
import accountContactInfo from "Session/Store/account-contact-info";
import loginDeviceLimitFlow from "Login/DeviceLimit/Store/loginDeviceLimitFlow/reducer";
import { twoFactorAuthenticationEnableFlow } from "Authentication/TwoFactorAuthentication/Flow/Enable/Store";
import { twoFactorAuthenticationDisableFlow } from "Authentication/TwoFactorAuthentication/Flow/Disable/Store";
import {
  ADD_PERSONAL_ITEM_FROM_TRANSACTION,
  CHANGES_FROM_TRANSACTIONS,
  CLOSE_SESSION,
  LOCAL_SETTINGS_UPDATED,
  PREMIUM_STATUS_UPDATED,
  REMOVE_PERSONAL_ITEM_FROM_TRANSACTION,
  SAVE_GENERATED_PASSWORD,
  SAVE_PERSONAL_ITEM,
  SAVE_PERSONAL_ITEMS,
  TransactionsAction,
} from "Session/Store/actions";
import {
  SAVE_GENERATED_PASSWORD as PERSONAL_DATA_SAVE_GENERATED_PASSWORD,
  SAVE_PERSONAL_ITEM as PERSONAL_DATA_SAVE_PERSONAL_ITEM,
  SAVE_PERSONAL_ITEMS as PERSONAL_DATA_SAVE_PERSONAL_ITEMS,
} from "Session/Store/personalData/actions";
import notificationsStatus from "Session/Store/notifications";
import sdkAuthentication from "Session/Store/sdk/index";
import session from "Session/Store/session";
import { UserSessionState } from "Session/Store";
import { VPNReducers as vpnData } from "VPN/reducer";
import { ImportDataStateReducer as importPersonalData } from "DataManagement/Import/state/reducer";
import { SecureFileStorageReducer as secureFileStorageState } from "Session/Store/secureFileStorage/reducer";
import { credentialsDedupViewReducer as credentialsDedupViewState } from "Session/Store/credentialsDedupView/reducer";
import { breachRefreshMetaDataReducer as breachRefreshMetaData } from "Session/Store/breachRefreshMetadata/reducer";
import { PersonalSettingsActionType } from "./personalSettings/actions";
export const userSessionRootReducer: Redux.Reducer<UserSessionState> = (
  state: UserSessionState,
  action: Action
): UserSessionState => {
  switch (action.type) {
    case CLOSE_SESSION:
      return undefined;
    case CHANGES_FROM_TRANSACTIONS:
      return applyChangesFromTransactions(state, action as TransactionsAction);
    case LOCAL_SETTINGS_UPDATED:
      const localSettingsData = action.data;
      return Object.assign({}, state, {
        localSettings: localSettings(
          state.localSettings,
          loadStoredLocalSettings(localSettingsData)
        ),
        spaceData: spaceData(
          state.spaceData,
          spacesUpdated(localSettingsData.premiumStatus.spaces)
        ),
      });
    case PREMIUM_STATUS_UPDATED:
      const premiumStatus = action.premiumStatus;
      return Object.assign({}, state, {
        localSettings: localSettings(
          state.localSettings,
          localSettingsPremiumStatusUpdated(premiumStatus)
        ),
        spaceData: spaceData(
          state.spaceData,
          spacesUpdated(premiumStatus.spaces)
        ),
      });
    default:
      return state;
  }
};
const applyChangesFromTransactions = (
  state: UserSessionState,
  transactions: TransactionsAction
): UserSessionState => {
  return transactions.actions.reduce((tempState, action) => {
    switch (action.type) {
      case PersonalSettingsActionType.EditFromTransaction:
        return {
          ...tempState,
          personalSettings: personalSettings(
            tempState.personalSettings,
            action
          ),
        };
      case REMOVE_PERSONAL_ITEM_FROM_TRANSACTION:
        return {
          ...tempState,
          personalData: removePersonalItemFromTransaction(
            tempState.personalData,
            action
          ),
        };
      case ADD_PERSONAL_ITEM_FROM_TRANSACTION:
        return {
          ...tempState,
          personalData: addPersonalItemFromTransaction(
            tempState.personalData,
            action
          ),
        };
    }
    return tempState;
  }, state);
};
const userSessionCrossSliceReducer: Redux.Reducer<UserSessionState> = (
  state: UserSessionState,
  action: Action
): UserSessionState => {
  switch (action.type) {
    case SAVE_GENERATED_PASSWORD:
      return Object.assign({}, state, {
        personalData: personalDataReducer(
          state.personalData,
          { ...action, type: PERSONAL_DATA_SAVE_GENERATED_PASSWORD },
          { spaces: state.localSettings.premiumStatus?.spaces ?? [] }
        ),
      });
    case SAVE_PERSONAL_ITEM:
      return Object.assign({}, state, {
        personalData: personalDataReducer(
          state.personalData,
          { ...action, type: PERSONAL_DATA_SAVE_PERSONAL_ITEM },
          { spaces: state.localSettings.premiumStatus?.spaces ?? [] }
        ),
      });
    case SAVE_PERSONAL_ITEMS:
      return Object.assign({}, state, {
        personalData: personalDataReducer(
          state.personalData,
          { ...action, type: PERSONAL_DATA_SAVE_PERSONAL_ITEMS },
          { spaces: state.localSettings.premiumStatus?.spaces ?? [] }
        ),
      });
    default:
      return state;
  }
};
export const userSessionReducer = (state: UserSessionState, action: Action) => {
  const userSessionMainReducer = combineReducers<UserSessionState>({
    abTests,
    account,
    accountContactInfo,
    accountCreation,
    authTicketInfo,
    credentialOTPs,
    changeMPData,
    directorySync,
    iconsCache,
    localSettings,
    loginDeviceLimitFlow,
    notificationsStatus,
    paymentsState,
    personalData: personalDataReducer,
    personalSettings,
    sdkAuthentication,
    recoveryData,
    session,
    sharingData,
    sharingSync,
    spaceData,
    ssoSettings,
    sync,
    teamAdminData,
    twoFactorAuthenticationEnableFlow,
    twoFactorAuthenticationDisableFlow,
    userActivity,
    vaultReport,
    vpnData,
    importPersonalData,
    secureFileStorageState,
    credentialsDedupViewState,
    breachRefreshMetaData,
  });
  const userSessionMainReducerForAction = partialRight(userSessionMainReducer, [
    action,
  ]);
  const userSessionCrossSliceReducerForAction = partialRight(
    userSessionCrossSliceReducer,
    [action]
  );
  return pipe(
    userSessionRootReducer,
    userSessionCrossSliceReducerForAction,
    userSessionMainReducerForAction
  )(state, action);
};
