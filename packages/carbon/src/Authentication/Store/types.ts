import { CurrentUserAuthenticationState } from "Authentication/Store/currentUser/types";
import { LocalAccountsAuthenticationState } from "Authentication/Store/localAccounts/types";
import { LocalUsersAuthenticationState } from "Authentication/Store/localUsers/types";
import { WebAuthnAuthenticationState } from "Authentication/Store/webAuthn/types";
import { U2FAuthenticationState } from "./u2f/types";
import { TwoFactorAuthenticationInfo } from "@dashlane/communication";
export interface LegacyDeviceRegistrationKey {
  type: "uki";
  uki: string;
}
export interface DeviceRegistrationKeys {
  type: "deviceKeys";
  deviceAccessKey: string;
  deviceSecretKey: string;
}
export type DeviceRegistrationType =
  | LegacyDeviceRegistrationKey
  | DeviceRegistrationKeys;
export interface AuthenticationState {
  currentUser: CurrentUserAuthenticationState;
  localAccounts: LocalAccountsAuthenticationState;
  localUsers: LocalUsersAuthenticationState;
  u2f: U2FAuthenticationState;
  webAuthnAuthentication: WebAuthnAuthenticationState;
  twoFactorAuthentication: TwoFactorAuthenticationInfo;
}
