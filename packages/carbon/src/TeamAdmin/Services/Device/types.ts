import {
  CreateTeamDeviceAccountFailure,
  CreateTeamDeviceAccountSuccess,
  DeactivateTeamDeviceError,
  GetTeamDeviceError,
  ListTeamDevicesError,
  RegisterTeamDeviceError,
  TeamDevice,
  TeamDevicePlatform,
} from "@dashlane/communication";
export interface RegisterTeamDeviceRequest {
  platform: TeamDevicePlatform;
  deviceName: string;
}
export interface RegisterTeamDeviceResultSuccess {
  success: true;
  data: {
    teamUuid: string;
    deviceAccessKey: string;
    deviceSecretKey: string;
  };
}
export interface RegisterTeamDeviceResultFailure {
  success: false;
  error: {
    code: RegisterTeamDeviceError;
  };
}
export type RegisterTeamDeviceResult =
  | RegisterTeamDeviceResultSuccess
  | RegisterTeamDeviceResultFailure;
export interface DeactivateTeamDeviceRequest {
  teamDeviceAccessKey: string;
}
export interface DeactivateTeamDeviceResultSuccess {
  success: true;
  data: Record<never, never>;
}
export interface DeactivateTeamDeviceResultFailure {
  success: false;
  error: {
    code: DeactivateTeamDeviceError;
  };
}
export type DeactivateTeamDeviceResult =
  | DeactivateTeamDeviceResultSuccess
  | DeactivateTeamDeviceResultFailure;
export type CreateTeamDeviceAccountResult =
  | CreateTeamDeviceAccountSuccess
  | CreateTeamDeviceAccountFailure;
export interface GetTeamDeviceRequest {
  teamDeviceAccessKey: string;
}
export interface GetTeamDeviceResultSuccess {
  success: true;
  data: {
    teamDevice: TeamDevice;
  };
}
export interface GetTeamDeviceResultFailure {
  success: false;
  error: {
    code: GetTeamDeviceError;
  };
}
export type GetTeamDeviceResult =
  | GetTeamDeviceResultSuccess
  | GetTeamDeviceResultFailure;
export interface ListTeamDevicesResultSuccess {
  success: true;
  data: {
    teamDevices: TeamDevice[];
  };
}
export interface ListTeamDevicesResultFailure {
  success: false;
  error: {
    code: ListTeamDevicesError;
  };
}
export type ListTeamDevicesResult =
  | ListTeamDevicesResultSuccess
  | ListTeamDevicesResultFailure;
