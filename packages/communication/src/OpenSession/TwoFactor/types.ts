export type SSOMigrationTypes =
  | "sso_member_to_admin"
  | "mp_user_to_sso_member"
  | "sso_member_to_mp_user";
interface TwoFactorAuthenticationClientBaseInfo {
  lastUpdateDateUnix: number;
  recoveryPhone: string;
  isDuoEnabled: boolean;
  hasU2FKeys: boolean;
  ssoInfo?: {
    serviceProviderUrl: string;
    migration?: SSOMigrationTypes;
  };
}
export type TwoFactorAuthenticationServerType =
  | "email_token"
  | "totp_device_registration"
  | "totp_login"
  | "sso";
export enum TwoFactorAuthenticationType {
  EMAIL_TOKEN = "email_token",
  DEVICE_REGISTRATION = "totp_device_registration",
  LOGIN = "totp_login",
  SSO = "sso",
}
export interface TwoFactorAuthenticationServerInfo
  extends TwoFactorAuthenticationClientBaseInfo {
  type: TwoFactorAuthenticationServerType;
}
export interface TwoFactorAuthenticationClientInfo
  extends TwoFactorAuthenticationClientBaseInfo {
  type: TwoFactorAuthenticationType;
  isTwoFactorAuthenticationEnabled: boolean;
  isTwoFactorAuthenticationEnforced: boolean;
  shouldEnforceTwoFactorAuthentication: boolean;
}
export enum TwoFactorAuthenticationInfoRequestStatus {
  UNKNOWN,
  PENDING,
  ERROR,
  READY,
}
export interface TwoFactorAuthenticationBaseInfo {
  status: TwoFactorAuthenticationInfoRequestStatus;
}
export interface TwoFactorAuthenticationInfoUnknown
  extends TwoFactorAuthenticationBaseInfo {
  status: TwoFactorAuthenticationInfoRequestStatus.UNKNOWN;
}
export interface TwoFactorAuthenticationInfoPending
  extends TwoFactorAuthenticationBaseInfo {
  status: TwoFactorAuthenticationInfoRequestStatus.PENDING;
}
export interface TwoFactorAuthenticationInfoError
  extends TwoFactorAuthenticationBaseInfo {
  status: TwoFactorAuthenticationInfoRequestStatus.ERROR;
}
export interface TwoFactorAuthenticationInfoReady
  extends TwoFactorAuthenticationBaseInfo,
    TwoFactorAuthenticationClientInfo {
  status: TwoFactorAuthenticationInfoRequestStatus.READY;
}
export type TwoFactorAuthenticationInfo =
  | TwoFactorAuthenticationInfoUnknown
  | TwoFactorAuthenticationInfoPending
  | TwoFactorAuthenticationInfoError
  | TwoFactorAuthenticationInfoReady;
enum EnforceTwoFactorAuthenticationType {
  LOGIN = "login",
  NEW_DEVICE = "newDevice",
  DISABLED = "disabled",
}
export const ENFORCE_TWO_FACTOR_AUTHENTICATION_ENABLED_VALUES = [
  EnforceTwoFactorAuthenticationType.LOGIN,
  EnforceTwoFactorAuthenticationType.NEW_DEVICE,
];
