import { Country } from "../../DataModel";
import { TwoFactorAuthenticationType } from "../../OpenSession";
import { AuthenticationCode as AuthenticationErrorCode } from "../types";
export interface RefreshTwoFactorAuthenticationInfoResultSuccess {
  success: true;
}
export interface RefreshTwoFactorAuthenticationInfoResultError {
  success: false;
}
export type RefreshTwoFactorAuthenticationInfoResult =
  | RefreshTwoFactorAuthenticationInfoResultSuccess
  | RefreshTwoFactorAuthenticationInfoResultError;
export interface RefreshU2FDevicesResultSuccess {
  success: true;
}
export enum RefreshU2FErrorCode {
  UNKNOWN_ERROR,
}
export interface RefreshU2FDevicesResultError {
  success: false;
  error: {
    code: RefreshU2FErrorCode;
  };
}
export type RefreshU2FDevicesResult =
  | RefreshU2FDevicesResultSuccess
  | RefreshU2FDevicesResultError;
export enum RemoveU2FAuthenticatorError {
  UNKNOWN_ERROR = "UNKNOWN_ERROR",
  NO_KEYHANDLE_FOUND = "NO_KEYHANDLE_FOUND",
  WRONG_AUTHENTICATION_CODE = "WRONG_AUTHENTICATION_CODE",
}
export interface RemoveU2FAuthenticatorRequest {
  keyHandle: string;
  authenticationCode: string;
}
export interface RemoveU2FAuthenticatorResult {
  success: boolean;
  error?: {
    code: RemoveU2FAuthenticatorError | AuthenticationErrorCode;
  };
}
export type TwoFactorAuthenticationTypeStageRequest = {
  authenticationType:
    | TwoFactorAuthenticationType.LOGIN
    | TwoFactorAuthenticationType.DEVICE_REGISTRATION;
};
export type CountryCode = Exclude<
  Country,
  [Country.UNIVERSAL, Country.NO_TYPE]
>;
export type BackupPhoneStageRequest = {
  phoneNumber: string;
  countryCode: CountryCode;
};
export type AuthenticationCodeEnableStageRequest = {
  authenticationCode: string;
};
export type TwoFactorAuthenticationEnableFlowStageRequest =
  | TwoFactorAuthenticationTypeStageRequest
  | BackupPhoneStageRequest
  | AuthenticationCodeEnableStageRequest
  | null;
export type TwoFactorAuthenticationEnableFlowStageResult = {
  success: boolean;
};
export type ChangeAuthenticationModeRequest = {
  target: string;
};
export type AuthenticationCodeSubmitRequest = {
  authenticationCode: string;
};
type AuthenticationCodeDisableStageRequest =
  | ChangeAuthenticationModeRequest
  | AuthenticationCodeSubmitRequest;
export type TwoFactorAuthenticationFlowStageResult = {
  success: boolean;
  error?: {
    code: AuthenticationErrorCode;
    message?: string;
  };
};
export type TwoFactorAuthenticationFlowStageRequest =
  AuthenticationCodeDisableStageRequest | null;
type TwoFactorAuthenticationViewMapperBase = {
  currentStep: number;
  totalSteps: number;
  error?: {
    code: string | AuthenticationErrorCode;
  };
};
export interface TwoFactorAuthenticationBackupPhoneViewMapper
  extends TwoFactorAuthenticationViewMapperBase {
  countryCode: CountryCode;
}
export interface TwoFactorAuthenticationQRCodeViewMapper
  extends TwoFactorAuthenticationViewMapperBase {
  seed: string;
  uri: string;
}
export interface TwoFactorAuthenticationBackupCodesViewMapper
  extends TwoFactorAuthenticationViewMapperBase {
  recoveryKeys: string[];
}
export type TwoFactorAuthenticationEnableFlowViewMappers =
  | TwoFactorAuthenticationViewMapperBase
  | TwoFactorAuthenticationBackupPhoneViewMapper
  | TwoFactorAuthenticationQRCodeViewMapper
  | TwoFactorAuthenticationBackupCodesViewMapper;
export interface TwoFactorAuthenticationEnableFlowStageData {
  stage: string;
  viewData?: TwoFactorAuthenticationEnableFlowViewMappers;
  savedValues?: {
    savedCountryCode?: CountryCode;
    savedPhoneNumber?: string;
    savedAuthenticationType?:
      | TwoFactorAuthenticationType.LOGIN
      | TwoFactorAuthenticationType.DEVICE_REGISTRATION;
  };
}
type TwoFactorAuthenticationCodeViewMapper = {
  success: false;
  error: {
    code: AuthenticationErrorCode;
  };
};
export type TwoFactorAuthenticationDisableFlowViewMappers =
  TwoFactorAuthenticationCodeViewMapper;
export interface TwoFactorAuthenticationFlowStageData {
  stage: string;
  viewData?: TwoFactorAuthenticationDisableFlowViewMappers;
}
export interface U2FDevice {
  keyHandle: string;
  name: string;
  creationDateUnix: number;
  lastUsedDateUnix: number;
  lastUsedFromIP: string;
  lastUsedFromThisIp: boolean;
  lastUsedFromCountry: string;
}
export enum TwoFactorAuthenticationEnableStages {
  AUTHENTICATION_TYPE = "AUTHENTICATION_TYPE",
  BACKUP_PHONE = "BACKUP_PHONE",
  QR_CODE = "QR_CODE",
  AUTHENTICATION_CODE = "AUTHENTICATION_CODE",
  LOADING = "LOADING",
  FINALIZING_CHANGES = "FINALIZING_CHANGES",
  BACKUP_CODES = "BACKUP_CODES",
  GENERIC_ERROR = "GENERIC_ERROR",
  LOGOUT_REQUIRED = "LOGOUT_REQUIRED",
  SUCCESS = "SUCCESS",
}
export enum TwoFactorAuthenticationDisableStages {
  CONFIRMATION = "CONFIRMATION",
  AUTHENTICATION_CODE = "AUTHENTICATION_CODE",
  BACKUP_CODE = "BACKUP_CODE",
  FINALIZING_CHANGES = "FINALIZING_CHANGES",
  SUCCESS = "SUCCESS",
  LOGOUT_REQUIRED = "LOGOUT_REQUIRED",
  GENERIC_ERROR = "GENERIC_ERROR",
}
export enum RequestTOTPActivationError {
  INTERNAL_ERROR = "internal_error",
  CANNOT_SEED_FOR_USER_WITH_TOTP_ENABLED = "cannot_seed_for_user_with_TOTP_enabled",
  OTP_FAILED = "otp_failed",
  TOTP_TYPE_IS_NOT_SET_TO_EMAIL_TOKEN = "totp_type_is_not_set_to_email_token",
  PHONE_VALIDATION_FAILED = "phone_validation_failed",
}
