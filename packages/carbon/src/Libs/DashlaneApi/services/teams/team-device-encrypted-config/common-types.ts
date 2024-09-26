import { UpdateTeamDeviceEncryptedConfigError } from "@dashlane/communication";
import { GetTeamDeviceEncryptedConfigError } from "./get-team-device-encrypted-config";
import {
  DeviceAccountMappingAlreadyExists,
  DeviceKeyNotFound,
  NotAdmin,
  TeamDeviceEncryptedConfigNotFound,
} from "Libs/DashlaneApi/services/errors";
import { UnknownError } from "Libs/DashlaneApi/types";
export const getTeamDeviceEncryptedConfigErrors: GetTeamDeviceEncryptedConfigError[] =
  [TeamDeviceEncryptedConfigNotFound, NotAdmin];
export const updateTeamDeviceEncryptedConfigErrors: UpdateTeamDeviceEncryptedConfigError[] =
  [
    NotAdmin,
    UnknownError,
    DeviceAccountMappingAlreadyExists,
    DeviceKeyNotFound,
  ];
