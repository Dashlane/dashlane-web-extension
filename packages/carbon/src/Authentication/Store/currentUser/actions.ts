import { RememberMeType } from "@dashlane/communication";
import { Action } from "Store";
import { DeviceRegisteredAction } from "Authentication/Store/actions";
import { CurrentUserAuthenticationState } from "Authentication/Store/currentUser/types";
export const REHYDRATE_USER_AUTHENTICATION_DATA =
  "REHYDRATE_USER_AUTHENTICATION_DATA";
export const SET_REMEMBER_ME_TYPE = "SET_REMEMBER_ME_TYPE";
export const rehydrateUserAuthenticationData = (
  data: CurrentUserAuthenticationState
): CurrentUserAuthenticationActionTypes => ({
  type: REHYDRATE_USER_AUTHENTICATION_DATA,
  data,
});
export const setRememberMeTypeAction = (
  rememberMeType: RememberMeType
): SetRememberMeTypeAction => ({
  type: SET_REMEMBER_ME_TYPE,
  rememberMeType,
});
export interface RehydrateUserAuthenticationData extends Action {
  data: CurrentUserAuthenticationState;
}
export interface SetRememberMeTypeAction extends Action {
  type: typeof SET_REMEMBER_ME_TYPE;
  rememberMeType: RememberMeType;
}
export type CurrentUserAuthenticationActionTypes =
  | DeviceRegisteredAction
  | RehydrateUserAuthenticationData
  | SetRememberMeTypeAction;
