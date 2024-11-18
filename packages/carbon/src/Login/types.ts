import {
  AdminPermissionLevel,
  AuthenticationCode,
  type RememberMeType,
} from "@dashlane/communication";
export interface SessionDidOpenOptions {
  triggeredByRememberMeType?: RememberMeType;
  isWebAuthnAuthenticatorRoaming?: boolean;
  requiredPermissions?: AdminPermissionLevel;
}
export const TokenOrOTPErrorCode = [
  AuthenticationCode.TOKEN_EXPIRED,
  AuthenticationCode.TOKEN_NOT_VALID,
  AuthenticationCode.TOKEN_TOO_MANY_ATTEMPTS,
  AuthenticationCode.EMPTY_TOKEN,
  AuthenticationCode.OTP_ALREADY_USED,
  AuthenticationCode.OTP_NOT_VALID,
  AuthenticationCode.OTP_TOO_MANY_ATTEMPTS,
  AuthenticationCode.EMPTY_OTP,
  AuthenticationCode.BACKUP_CODE_NOT_VALID,
];
export const DashlaneAuthenticatorErrorCode = [
  AuthenticationCode.DASHLANE_AUTHENTICATOR_LOGIN_CANCELLED,
  AuthenticationCode.DASHLANE_AUTHENTICATOR_PUSH_NOTIFICATION_DENIED,
  AuthenticationCode.FAILED_TO_CONTACT_AUTHENTICATOR_DEVICE,
];
