import { SSOSettingsData } from "@dashlane/communication";
import { Action } from "Store";
export const SET_SSO_SETTINGS = "SET_SSO_SETTINGS";
export default (state = getEmptySSOSettings(), action: Action) => {
  switch (action.type) {
    case SET_SSO_SETTINGS: {
      return Object.assign({}, state, { ...action.data });
    }
    default:
      return state;
  }
};
export function getEmptySSOSettings(): SSOSettingsData {
  return {
    ssoUser: false,
    serviceProviderUrl: "",
    ssoServiceProviderKey: "",
    migration: undefined,
    ssoToken: "",
  };
}
