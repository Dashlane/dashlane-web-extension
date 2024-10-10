import { combineReducers } from "redux";
import { AuthenticationState } from "Authentication/Store/types";
import {
  currentUserAuthenticationReducer as currentUser,
  getEmptyCurrentUserAuthentication,
} from "Authentication/Store/currentUser/reducer";
import {
  getEmptyLocalAccountsAuthenticationState,
  localAccountsAuthenticationReducer as localAccounts,
} from "Authentication/Store/localAccounts/reducer";
import {
  getEmptyLocalUsersAuthentication,
  localUsersAuthenticationReducer as localUsers,
} from "Authentication/Store/localUsers/reducer";
import {
  getEmptyU2FAuthenticationState,
  u2fAuthenticationReducer as u2f,
} from "Authentication/Store/u2f/reducer";
import {
  getEmptyTwoFactorAuthenticationState,
  TwoFactorAuthenticationReducer as twoFactorAuthentication,
} from "Authentication/TwoFactorAuthentication/Store/reducer";
import {
  getEmptyWebAuthnAuthentication,
  webAuthnAuthenticationReducer as webAuthnAuthentication,
} from "Authentication/Store/webAuthn/reducer";
export const getEmptyAuthenticationState = (): AuthenticationState => ({
  currentUser: getEmptyCurrentUserAuthentication(),
  localAccounts: getEmptyLocalAccountsAuthenticationState(),
  localUsers: getEmptyLocalUsersAuthentication(),
  u2f: getEmptyU2FAuthenticationState(),
  webAuthnAuthentication: getEmptyWebAuthnAuthentication(),
  twoFactorAuthentication: getEmptyTwoFactorAuthenticationState(),
});
export const authenticationReducer = combineReducers<AuthenticationState>({
  currentUser,
  localAccounts,
  localUsers,
  u2f,
  webAuthnAuthentication,
  twoFactorAuthentication,
});
