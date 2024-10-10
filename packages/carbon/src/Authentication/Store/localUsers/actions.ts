import { Action } from "Store";
import {
  LocalUserAuthenticationState,
  LocalUsersAuthenticationState,
} from "Authentication/Store/localUsers/types";
import {
  DEVICE_REGISTERED,
  DeviceRegisteredAction,
} from "Authentication/Store/actions";
export const LOAD_LOCAL_USERS_AUTH_DATA_FROM_STORAGE =
  "LOAD_LOCAL_USERS_AUTH_DATA_FROM_STORAGE";
export const UPDATE_LOCAL_USER_INFO = "UPDATE_LOCAL_USER_INFO";
export const loadLocalUsersAuthenticationData = (
  data: LocalUsersAuthenticationState
): LocalUsersAuthenticationActionTypes => ({
  type: LOAD_LOCAL_USERS_AUTH_DATA_FROM_STORAGE,
  data,
});
export const updateLocalUserInfo = (
  login: string,
  data: Partial<LocalUserAuthenticationState>
): UpdateLocalUserInfo => ({
  type: UPDATE_LOCAL_USER_INFO,
  login,
  data,
});
export interface LocalUserAuthenticationAction extends Action {
  login: string;
}
export type LocalUserAuthenticationActionTypes = DeviceRegisteredAction;
export const isLocalUserAuthenticationAction = (
  action: Action
): action is LocalUserAuthenticationActionTypes =>
  action.type === DEVICE_REGISTERED;
export interface LoadLocalUsersAuthenticationDataAction extends Action {
  type: typeof LOAD_LOCAL_USERS_AUTH_DATA_FROM_STORAGE;
  data: LocalUsersAuthenticationState;
}
export interface UpdateLocalUserInfo extends Action {
  type: typeof UPDATE_LOCAL_USER_INFO;
  login: string;
  data: Partial<LocalUserAuthenticationState>;
}
export type LocalUsersAuthenticationActionTypes =
  | LoadLocalUsersAuthenticationDataAction
  | LocalUserAuthenticationActionTypes
  | UpdateLocalUserInfo;
