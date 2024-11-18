import {
  LOAD_ANONYMOUS_PARTNER_ID,
  LOAD_CLIENT_AUTHENTICATION_DATA,
  SAVE_APP_KEYS,
  SAVE_DASHLANE_SERVER_DELTA_TIMESTAMP,
  SAVE_STYX_KEYS,
} from "Session/Store/sdk/actions";
import { Action } from "Store";
import { SdkAuthentication } from "./types";
export function getEmptySdkAuthentication(): SdkAuthentication {
  return {
    anonymousPartnerId: null,
    appKeys: null,
    dashlaneServerDeltaTimestamp: null,
    styxKeys: null,
  };
}
export default (state = getEmptySdkAuthentication(), action: Action) => {
  switch (action.type) {
    case SAVE_APP_KEYS:
      return {
        ...state,
        appKeys: action.appKeys,
      };
    case SAVE_STYX_KEYS:
      return {
        ...state,
        styxKeys: action.styxKeys,
      };
    case SAVE_DASHLANE_SERVER_DELTA_TIMESTAMP:
      return {
        ...state,
        dashlaneServerDeltaTimestamp: action.dashlaneServerDeltaTimestamp,
      };
    case LOAD_CLIENT_AUTHENTICATION_DATA:
      return { ...state, ...action.data };
    case LOAD_ANONYMOUS_PARTNER_ID:
      return { ...state, ...action };
    default:
      return state;
  }
};
