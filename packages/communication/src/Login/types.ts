import { UserConsent } from "../AccountCreation";
import { ChangeMasterPasswordCode } from "../ChangeMasterPassword";
import { AdminPermissionLevel } from "../OpenSession";
export enum LoginResultEnum {
  MasterPasswordMissing,
  DeviceAuthenticationMissing,
  TokenMissing,
  OTPMissing,
  AskPersistData,
  LoggedIn,
  ExtraDeviceTokenMissing,
  SSOLogin,
  DeviceLimitFlow,
  DashlaneAuthenticatorApprovalMissing,
  DashlaneAuthenticatorApprovalCancelled,
  MasterPasswordLess,
}
export enum SsoMigrationServerMethod {
  SSO = "sso",
  MP = "master_password",
}
export interface LoginViaSSO {
  consents?: UserConsent[];
  anonymousUserId?: string;
  deviceName: string;
  exist: boolean;
  ssoServiceProviderKey: string;
  login: string;
  ssoToken: string;
  currentAuths: SsoMigrationServerMethod;
  expectedAuths: SsoMigrationServerMethod;
  inStore: boolean;
  requiredPermissions: AdminPermissionLevel | null;
  shouldRememberMeForSSO: boolean;
}
export enum LoginViaSsoCode {
  SUCCESS = "SUCCESS",
  ASK_NEW_MP = "ASK_NEW_MP",
  EMPTY_LOGIN = "EMPTY_LOGIN",
  INNACTIVE_SESSION = "INNACTIVE_SESSION",
  SSO_VERIFICATION_FAILED = "SSO_VERIFICATION_FAILED",
  UNKNOWN_ERROR = "UNKNOWN_ERROR",
  UNSUPPORTED_TRANSITION = "UNSUPPORTED_TRANSITION",
  WRONG_PASSWORD = "WRONG_PASSWORD",
  SSO_LOGIN_CORRUPT = "SSO_LOGIN_CORRUPT",
}
export type LoginViaSsoSuccess = {
  success: true;
  code: LoginViaSsoCode;
};
export type LoginViaSsoError = {
  success: false;
  error: {
    code: LoginViaSsoCode | ChangeMasterPasswordCode;
    message?: string;
  };
};
export type LoginViaSSOResult = LoginViaSsoSuccess | LoginViaSsoError;
