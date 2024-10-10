import { PersistData } from "Session/types";
import { Action } from "Store";
import {
  DeviceRegistrationKeys,
  DeviceRegistrationType,
  LegacyDeviceRegistrationKey,
} from "Authentication/Store/types";
export const DEVICE_REGISTERED = "DEVICE_REGISTERED";
export const makeLegacyDeviceRegistrationKey = (
  uki: string
): LegacyDeviceRegistrationKey => ({
  type: "uki",
  uki,
});
export const makeDeviceRegistrationKeys = (
  deviceAccessKey: string,
  deviceSecretKey: string
): DeviceRegistrationKeys => ({
  type: "deviceKeys",
  deviceAccessKey,
  deviceSecretKey,
});
export const deviceRegistered = (
  registrationType: DeviceRegistrationType,
  persistData: PersistData,
  login: string
): UserAuthenticationActionTypes => ({
  type: DEVICE_REGISTERED,
  registrationType,
  persistData,
  login,
});
export interface DeviceRegisteredAction extends Action {
  type: typeof DEVICE_REGISTERED;
  login: string;
  registrationType: DeviceRegistrationType;
  persistData: PersistData;
}
export type UserAuthenticationActionTypes = DeviceRegisteredAction;
export type AuthenticationActionTypes = UserAuthenticationActionTypes;
