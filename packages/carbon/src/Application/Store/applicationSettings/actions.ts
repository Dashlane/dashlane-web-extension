import { Action } from "Store";
import { ApplicationSettings } from "Application/Store/applicationSettings";
import { UserPublicSettings } from "Application/ApplicationSettings";
export const STORE_APPLICATION_SETTINGS = "STORE_APPLICATION_SETTINGS";
export const STORE_USER_PUBLIC_SETTING = "STORE_USER_PUBLIC_SETTING";
export const DELETE_USER_PUBLIC_SETTINGS = "DELETE_USER_PUBLIC_SETTINGS";
export interface StoreApplicationSettingsAction extends Action {
  type: typeof STORE_APPLICATION_SETTINGS;
  settings: Partial<ApplicationSettings>;
}
export interface StoreUserPublicSettingsAction {
  type: typeof STORE_USER_PUBLIC_SETTING;
  login: string;
  userSettings: UserPublicSettings;
}
export interface DeleteUserPublicSettingsAction {
  type: typeof DELETE_USER_PUBLIC_SETTINGS;
  logins: string[];
}
export type ApplicationSettingsActionTypes =
  | StoreApplicationSettingsAction
  | StoreUserPublicSettingsAction
  | DeleteUserPublicSettingsAction;
export const storeApplicationSettings = (
  settings: Partial<ApplicationSettings>
): StoreApplicationSettingsAction => ({
  type: STORE_APPLICATION_SETTINGS,
  settings,
});
export const storeUserPublicSetting = (
  login: string,
  userSettings: UserPublicSettings
): StoreUserPublicSettingsAction => ({
  type: STORE_USER_PUBLIC_SETTING,
  login,
  userSettings,
});
export const deleteUserPublicSettings = (
  logins: string[]
): DeleteUserPublicSettingsAction => ({
  type: DELETE_USER_PUBLIC_SETTINGS,
  logins,
});
