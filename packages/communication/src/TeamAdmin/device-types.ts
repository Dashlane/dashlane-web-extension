import {
  DeactivatedTeamDevice,
  DeviceAccountMappingAlreadyExists,
  DeviceKeyNotFound,
  InvalidTeamDeviceLogin,
  NotAdmin,
  UnknownTeamAdminError,
} from "./errors";
export enum TeamDevicePlatform {
  SSO_CONNECTOR = "sso_connector",
  ENCRYPTION_SERVICE = "encryption_service",
  NITRO = "nitro_encryption_service",
}
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
export type RegisterTeamDeviceError =
  | typeof NotAdmin
  | typeof UnknownTeamAdminError;
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
export type DeactivateTeamDeviceError =
  | typeof NotAdmin
  | typeof UnknownTeamAdminError
  | typeof DeviceKeyNotFound
  | typeof DeactivatedTeamDevice;
export interface DeactivateTeamDeviceResultFailure {
  success: false;
  error: {
    code: DeactivateTeamDeviceError;
  };
}
export type DeactivateTeamDeviceResult =
  | DeactivateTeamDeviceResultSuccess
  | DeactivateTeamDeviceResultFailure;
export interface CreateTeamDeviceAccountRequest {
  teamDeviceAccessKey: string;
  publicKey: string;
  userGroupRevision: number;
  proposeSignature: string;
  groupKey: string;
  teamDeviceLogin: string;
}
export type CreateTeamDeviceAccountSuccess = {
  success: true;
  data: {
    login: string;
  };
};
export type CreateTeamDeviceAccountError =
  | typeof NotAdmin
  | typeof UnknownTeamAdminError
  | typeof DeviceAccountMappingAlreadyExists
  | typeof DeviceKeyNotFound
  | typeof InvalidTeamDeviceLogin;
export type CreateTeamDeviceAccountFailure = {
  success: false;
  error: {
    code: CreateTeamDeviceAccountError;
  };
};
export type CreateTeamDeviceAccountResult =
  | CreateTeamDeviceAccountSuccess
  | CreateTeamDeviceAccountFailure;
export type TeamDevice = {
  creationDateUnix: number;
  updateDateUnix: number;
  teamId: number;
  deviceName: string | null;
  version: string | null;
  activated: boolean;
  accessKey: string;
  configVersion: number | null;
  hasDraftConfig: boolean;
  lastStartDateUnix: number | null;
  hosting: string | null;
  media: string | null;
  hasLatestVersion: boolean;
  hasLatestConfig: boolean;
  lastActivityDateUnix: number | null;
};
export interface GetTeamDeviceRequest {
  teamDeviceAccessKey: string;
}
export interface GetTeamDeviceResultSuccess {
  success: true;
  data: {
    teamDevice: TeamDevice;
  };
}
export type GetTeamDeviceError = typeof NotAdmin | typeof UnknownTeamAdminError;
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
export type ListTeamDevicesError =
  | typeof NotAdmin
  | typeof UnknownTeamAdminError;
export interface ListTeamDevicesResultFailure {
  success: false;
  error: {
    code: ListTeamDevicesError;
  };
}
export type ListTeamDevicesResult =
  | ListTeamDevicesResultSuccess
  | ListTeamDevicesResultFailure;
