import { DeviceInfo } from "@dashlane/communication";
import { _makeRequest } from "Libs/WS/request";
const WSVERSION = 1;
const WSNAME = "devices";
export interface WSDevices {
  list: (params: { login: string; uki: string }) => Promise<DeviceInfo[]>;
  deactivate: (params: {
    login: string;
    uki: string;
    deviceId: string;
  }) => Promise<WSDeactivateResult>;
  changeName: (params: {
    login: string;
    uki: string;
    deviceId: string;
    updatedDeviceName: string;
  }) => Promise<WSUpdateNameResult>;
}
export const makeWSDevices = (): WSDevices => {
  return {
    list: (params: { login: string; uki: string }) => list(params),
    deactivate: (params: { login: string; uki: string; deviceId: string }) =>
      deactivate(params),
    changeName: (params: {
      login: string;
      uki: string;
      deviceId: string;
      updatedDeviceName: string;
    }) => changeName(params),
  };
};
interface WSListResult {
  status: string;
  content: DeviceInfo[];
}
export interface WSDeactivateResult {
  status: string;
  content?: string;
}
export interface WSUpdateNameResult {
  status: string;
  content?: string;
}
const list = (params: {
  login: string;
  uki: string;
}): Promise<DeviceInfo[]> => {
  return _makeRequest(WSNAME, WSVERSION, "list", {
    login: params.login,
    uki: params.uki,
  }).then((result: WSListResult) => result.content);
};
const deactivate = (params: {
  login: string;
  uki: string;
  deviceId: string;
}): Promise<WSDeactivateResult> => {
  return _makeRequest(WSNAME, WSVERSION, "deactivate", {
    login: params.login,
    uki: params.uki,
    deviceId: params.deviceId,
  });
};
const changeName = (params: {
  login: string;
  uki: string;
  deviceId: string;
  updatedDeviceName: string;
}): Promise<WSUpdateNameResult> => {
  return _makeRequest(WSNAME, WSVERSION, "changename", {
    login: params.login,
    uki: params.uki,
    deviceId: params.deviceId,
    updatedName: params.updatedDeviceName,
  });
};
