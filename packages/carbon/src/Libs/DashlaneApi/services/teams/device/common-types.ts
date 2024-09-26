import {
  CreateTeamDeviceAccountError,
  DeactivateTeamDeviceError,
  GetTeamDeviceError,
  ListTeamDevicesError,
  RegisterTeamDeviceError,
} from "@dashlane/communication";
import {
  DeactivatedTeamDevice,
  DeviceAccountMappingAlreadyExists,
  DeviceKeyNotFound,
  InvalidTeamDeviceLogin,
  NotAdmin,
} from "Libs/DashlaneApi/services/errors";
import { UnknownError } from "Libs/DashlaneApi/types";
export const registerTeamDeviceErrors: RegisterTeamDeviceError[] = [
  NotAdmin,
  UnknownError,
];
export const deactivateTeamDeviceErrors: DeactivateTeamDeviceError[] = [
  NotAdmin,
  UnknownError,
  DeviceKeyNotFound,
  DeactivatedTeamDevice,
];
export const createTeamDeviceAccountErrors: CreateTeamDeviceAccountError[] = [
  NotAdmin,
  DeviceAccountMappingAlreadyExists,
  InvalidTeamDeviceLogin,
];
export const getTeamDeviceErrors: GetTeamDeviceError[] = [
  NotAdmin,
  UnknownError,
];
export const listTeamDevicesErrors: ListTeamDevicesError[] = [
  NotAdmin,
  UnknownError,
];
