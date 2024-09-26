import { ExtensionSettings } from "@dashlane/communication";
import { Action } from "Store";
export const SET_GLOBAL_EXTENSION_SETTINGS = "SET_GLOBAL_EXTENSION_SETTINGS";
export const setGlobalExtensionSettingsState = (
  extensionSettings: ExtensionSettings
): Action => ({
  type: SET_GLOBAL_EXTENSION_SETTINGS,
  extensionSettings,
});
