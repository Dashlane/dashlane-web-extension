import { AppKeys, SdkAuthentication } from "Session/Store/sdk/types";
import { getUnixTimestamp } from "Utils/getUnixTimestamp";
export const SAVE_APP_KEYS = "SAVE_APP_KEYS";
export const SAVE_STYX_KEYS = "SAVE_STYX_KEYS";
export const SAVE_DASHLANE_SERVER_DELTA_TIMESTAMP =
  "SAVE_DASHLANE_SERVER_DELTA_TIMESTAMP";
export const LOAD_CLIENT_AUTHENTICATION_DATA =
  "LOAD_CLIENT_AUTHENTICATION_DATA";
export const LOAD_ANONYMOUS_PARTNER_ID = "LOAD_ANONYMOUS_PARTNER_ID";
export const saveDashlaneServerDeltaTimestamp = (time: number) => {
  return {
    type: SAVE_DASHLANE_SERVER_DELTA_TIMESTAMP,
    dashlaneServerDeltaTimestamp: Math.round(getUnixTimestamp() - time),
  };
};
export const saveAppKeys = (appKeys: AppKeys) => {
  return {
    type: SAVE_APP_KEYS,
    appKeys,
  };
};
export const saveStyxKeys = (styxKeys: AppKeys) => {
  return {
    type: SAVE_STYX_KEYS,
    styxKeys,
  };
};
export const loadSdkAuthentication = (data: SdkAuthentication) => {
  return {
    type: LOAD_CLIENT_AUTHENTICATION_DATA,
    data,
  };
};
export const loadAnonymousPartnerId = (anonymousPartnerId: string) => {
  return {
    type: LOAD_ANONYMOUS_PARTNER_ID,
    anonymousPartnerId,
  };
};
