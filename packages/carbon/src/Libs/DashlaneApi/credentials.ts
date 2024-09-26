import {
  appKeysSelector,
  deviceKeysSelector,
  getDeviceAccessKeySelector,
  sessionKeysSelector,
} from "Authentication/selectors";
import { State } from "Store";
import { assertUnreachable } from "Helpers/assert-unreachable";
import { ApiAuthType, AuthParams } from "Libs/DashlaneApi/types";
export interface AppCredentials {
  type: "App";
  appKeys: {
    accessKey: string;
    secretKey: string;
  };
}
export interface DeviceCredentials {
  type: "UserDevice";
  appKeys: {
    accessKey: string;
    secretKey: string;
  };
  login: string;
  deviceKeys: {
    accessKey: string;
    secretKey: string;
  };
}
export interface SessionCredentials {
  type: "Session";
  appKeys: {
    accessKey: string;
    secretKey: string;
  };
  login: string;
  deviceId: string;
  sessionKeys: {
    accessKey: string;
    secretKey: string;
  };
}
export interface TeamDeviceCredentials {
  type: "TeamDevice";
  appKeys: {
    accessKey: string;
    secretKey: string;
  };
  teamUuid: string;
  deviceKeys: {
    accessKey: string;
    secretKey: string;
  };
}
export interface NoneCredentials {
  type: "None";
}
export type ApiCredentials =
  | AppCredentials
  | DeviceCredentials
  | SessionCredentials
  | TeamDeviceCredentials
  | NoneCredentials;
export function getApiCredentials(
  state: State,
  params: AuthParams
): ApiCredentials {
  if (params.authenticationType === ApiAuthType.None) {
    return { type: params.authenticationType };
  }
  const appCredentials = {
    appKeys: appKeysSelector(state),
  };
  switch (params.authenticationType) {
    case ApiAuthType.App:
      return {
        type: ApiAuthType.App,
        ...appCredentials,
      };
    case ApiAuthType.UserDevice:
      return {
        type: ApiAuthType.UserDevice,
        ...appCredentials,
        login: params.login,
        deviceKeys: deviceKeysSelector(state),
      };
    case ApiAuthType.Session:
      return {
        type: ApiAuthType.Session,
        ...appCredentials,
        login: params.login,
        sessionKeys: sessionKeysSelector(state),
        deviceId: getDeviceAccessKeySelector(state, params.login),
      };
    case ApiAuthType.TeamDevice:
      return {
        type: ApiAuthType.TeamDevice,
        ...appCredentials,
        teamUuid: params.teamUuid,
        deviceKeys: deviceKeysSelector(state),
      };
    default:
      assertUnreachable(params.authenticationType);
  }
}
