import {
  LOCAL_ACCOUNTS_LIST_UPDATED,
  LocalAccountsAuthenticationActionTypes,
  LocalAccountsAuthenticationState,
  REACTIVATION_STATUS_UPDATED,
  ReactivationStatus,
} from "Authentication/Store/localAccounts/types";
export const getEmptyLocalAccountsAuthenticationState =
  (): LocalAccountsAuthenticationState => ({
    accountsList: [],
    accountsListInitialized: false,
    reactivationStatus: ReactivationStatus.CLASSIC,
  });
export const localAccountsAuthenticationReducer = (
  state: LocalAccountsAuthenticationState = getEmptyLocalAccountsAuthenticationState(),
  action: LocalAccountsAuthenticationActionTypes
): LocalAccountsAuthenticationState => {
  switch (action.type) {
    case LOCAL_ACCOUNTS_LIST_UPDATED:
      return {
        ...state,
        accountsList: action.localAccounts,
        accountsListInitialized: true,
      };
    case REACTIVATION_STATUS_UPDATED:
      return { ...state, reactivationStatus: action.reactivationStatus };
    default:
      return state;
  }
};
