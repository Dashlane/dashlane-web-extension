import { ValuesType } from "@dashlane/framework-types";
export const EmailTokenApiError = "SEND_TOKEN_FAILED";
export type ApiErrorType = typeof EmailTokenApiError;
export type EmailTokenResult = EmailTokenSuccess | EmailTokenError;
export interface EmailTokenSuccess {
  success: true;
}
export interface EmailTokenError {
  success: false;
  error: {
    code: ApiErrorType;
    message: string;
  };
}
export interface AccountTokens {
  customerId: string;
  tokenId: string;
}
export type PaymentUpdateToken =
  | PaymentUpdateTokenSuccess
  | PaymentUpdateTokenError;
export interface PaymentUpdateTokenSuccess {
  success: true;
  accessKey: string;
  creationDateUnix: number;
  expirationDateUnix: number;
  secretKey: string;
  livemode: boolean;
  b2bPaymentTokens?: AccountTokens | Record<string, never>;
  b2cPaymentTokens?: AccountTokens | Record<string, never>;
}
export interface PaymentUpdateTokenError {
  success: false;
}
export enum ReactivationStatus {
  DISABLED = "DISABLED",
  CLASSIC = "CLASSIC",
  WEBAUTHN = "WEBAUTHN",
}
export interface SetReactivationStatusRequest {
  reactivationStatus: ReactivationStatus;
}
export enum PersistData {
  PERSIST_DATA_YES = 0,
  PERSIST_DATA_NO = 1,
}
export interface RegisterDeviceData {
  login: string;
  deviceAccessKey: string;
  deviceSecretKey: string;
  settings: {
    backupDate: number;
    identifier: string;
    time: number;
    content: string;
    type: "SETTINGS";
    action: "BACKUP_EDIT";
  };
  serverKey?: string;
  deviceAnalyticsId: string;
  userAnalyticsId: string;
  publicUserId: string;
  isDataPersisted: PersistData;
  deviceName?: string;
}
export const UserVerificationMethods = Object.freeze({
  MasterPassword: "masterPassword",
  Webauthn: "webauthn",
});
export type UserVerificationMethod = ValuesType<typeof UserVerificationMethods>;
export enum OtpType {
  NO_OTP = 0,
  OTP_NEW_DEVICE = 1,
  OTP_LOGIN = 2,
}
export enum AuthenticationCode {
  INVALID_LOGIN,
  EMPTY_LOGIN,
  EMPTY_MASTER_PASSWORD,
  EMPTY_ENCRYPTED_KEY,
  INVALID_ENCRYPTED_KEY,
  EMPTY_TOKEN,
  EMPTY_OTP,
  SEND_TOKEN_FAILED,
  UKI_REGISTRATION_FAILED,
  REGISTER_DEVICE_FAILED,
  BUSINESS_ERROR,
  USER_DOESNT_EXIST,
  USER_DOESNT_EXIST_UNLIKELY_MX,
  USER_DOESNT_EXIST_INVALID_MX,
  USER_UNAUTHORIZED,
  WRONG_PASSWORD,
  DATA_TAMPERED_ERROR,
  LOGGEDIN,
  ASK_TOKEN,
  ASK_OTP,
  ASK_MASTER_PASSWORD,
  USE_LOCAL_UKI,
  ASK_DASHLANE_AUTHENTICATOR,
  OTP_NOT_VALID,
  OTP_TOO_MANY_ATTEMPTS,
  OTP_ALREADY_USED,
  BACKUP_CODE_NOT_VALID,
  TOKEN_NOT_VALID,
  DASHLANE_AUTHENTICATOR_PUSH_NOTIFICATION_DENIED,
  SERVER_KEY_MISSING,
  TOKEN_LOCKED,
  TOKEN_TOO_MANY_ATTEMPTS,
  TOKEN_ACCOUNT_LOCKED,
  TOKEN_EXPIRED,
  NO_ACTIVE_AUTHENTICATOR,
  FAILED_TO_CONTACT_AUTHENTICATOR_DEVICE,
  DASHLANE_AUTHENTICATOR_ASKED_FOR_LOCAL_SESSION,
  DASHLANE_AUTHENTICATOR_LOGIN_CANCELLED,
  TOKEN_PROVIDED_FOR_LOCAL_SESSION,
  DEVICE_ALREADY_REGISTERED,
  OTP_PROVIDED_FOR_LOCAL_NON_OTP_SESSION,
  DIFFERENT_LOGIN_PROVIDED_WITH_TOKEN_OR_OTP,
  UNKNOWN_SYNC_ERROR,
  INVALID_UKI,
  UNKNOWN_UKI,
  UNKNOWN_ERROR,
  UNEXPECTED_OTP_TYPE,
  UNAUTHORIZED,
  UNAUTHORIZED_NOT_VALID_CONTENT,
  NETWORK_ERROR,
  THROTTLED,
  SESSION_ALREADY_OPENED,
  INVALID_SESSION,
  DEVICE_NOT_REGISTERED,
  MISSING_APP_KEYS,
  PROVIDE_EXTRA_DEVICE_TOKEN,
  PROVIDE_MASTER_PASSWORD_FOR_EXTRA_DEVICE,
  PROVIDE_MASTER_PASSWORD_AND_SERVER_KEY_FOR_EXTRA_DEVICE,
  ASK_OTP_FOR_NEW_DEVICE,
  TEAM_GENERIC_ERROR,
  SSO_LOGIN_BYPASS,
  SSO_VERIFICATION_FAILED,
  SSO_BLOCKED,
  CLIENT_VERSION_DOES_NOT_SUPPORT_SSO_MIGRATION,
  USER_DOESNT_EXIST_SSO,
}
