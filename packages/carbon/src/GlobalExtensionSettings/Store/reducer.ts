import * as Redux from "redux";
import { Action } from "Store";
import { GlobalExtensionSettingsState } from "GlobalExtensionSettings/Store/types";
import { SET_GLOBAL_EXTENSION_SETTINGS } from "./actions";
export const globalExtensionSettingsReducer: Redux.Reducer<
  GlobalExtensionSettingsState
> = (
  state: GlobalExtensionSettingsState = {},
  action: Action
): GlobalExtensionSettingsState => {
  switch (action.type) {
    case SET_GLOBAL_EXTENSION_SETTINGS:
      return Object.assign({}, state, {
        extensionSettings: action.extensionSettings,
      });
    default:
      return state;
  }
};
