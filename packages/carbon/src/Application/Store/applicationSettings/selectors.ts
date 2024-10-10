import { State } from "Store";
import {
  CommonApplicationSettings,
  UserPublicSettings,
} from "Application/ApplicationSettings";
const EMPTY_PUBLIC_USERS_SETTINGS = {};
export const abTestsNamesSelector = (state: State): string[] => {
  return state.device.application.settings.userABTestNames;
};
export const userPublicSettingsSelector = (
  state: State,
  login: string
): UserPublicSettings | undefined => {
  return state.device.application.settings.publicUsersSettings?.[login];
};
export const publicUsersSettingsSelector = (state: State) => {
  return (
    state.device.application.settings.publicUsersSettings ??
    EMPTY_PUBLIC_USERS_SETTINGS
  );
};
export const commonApplicationSettingsSelector = (
  state: State
): CommonApplicationSettings | undefined =>
  state.device.application.settings.commonApplicationSettings;
