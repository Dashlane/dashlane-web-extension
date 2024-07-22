import { FunctionalError } from "@dashlane/framework-types";
export enum FunctionalErrorName {
  VERIFICATION_FAILED = "verification_failed",
  VERIFICATION_TIMEOUT = "verification_timeout",
  VERIFICATION_REQUIRES_REQUEST = "verification_requires_request",
  ACCOUNT_BLOCKED_CONTACT_SUPPORT = "account_blocked_contact_support",
  INVALID_OTP_ALREADY_USED = "invalid_otp_already_used",
  INVALID_OTP_BLOCKED = "invalid_otp_blocked",
}
export class VerificationFailedError extends FunctionalError(
  FunctionalErrorName.VERIFICATION_FAILED,
  ""
) {}
export class VerificationTimeoutError extends FunctionalError(
  FunctionalErrorName.VERIFICATION_TIMEOUT,
  ""
) {}
export class VerificationRequiresRequestError extends FunctionalError(
  FunctionalErrorName.VERIFICATION_REQUIRES_REQUEST,
  ""
) {}
export class AccountBlockedContactSupportError extends FunctionalError(
  FunctionalErrorName.ACCOUNT_BLOCKED_CONTACT_SUPPORT,
  ""
) {}
export class InvalidOTPAlreadyUsedError extends FunctionalError(
  FunctionalErrorName.INVALID_OTP_ALREADY_USED,
  ""
) {}
export class InvalidOTPBlockedError extends FunctionalError(
  FunctionalErrorName.INVALID_OTP_BLOCKED,
  ""
) {}
export class NetworkError extends FunctionalError("network_error", "") {}
export type PerformEmailTokenVerificationError =
  | VerificationFailedError
  | VerificationTimeoutError
  | VerificationRequiresRequestError
  | AccountBlockedContactSupportError
  | NetworkError;
export type PerformTotpVerificationError =
  | VerificationFailedError
  | InvalidOTPAlreadyUsedError
  | InvalidOTPBlockedError
  | NetworkError;
export type PerformDashlaneAuthenticatorVerificationError =
  | VerificationFailedError
  | VerificationTimeoutError
  | NetworkError;
export enum EmailTokenErrorCode {
  TOKEN_NOT_VALID = "TOKEN_NOT_VALID",
  TOKEN_EXPIRED = "TOKEN_EXPIRED",
  TOKEN_TOO_MANY_ATTEMPTS = "TOKEN_TOO_MANY_ATTEMPTS",
  TOKEN_ACCOUNT_LOCKED = "TOKEN_ACCOUNT_LOCKED",
}
export enum TotpErrorCode {
  OTP_NOT_VALID = "OTP_NOT_VALID",
  OTP_TOO_MANY_ATTEMPTS = "OTP_TOO_MANY_ATTEMPTS",
  OTP_ALREADY_USED = "OTP_ALREADY_USED",
  BACKUP_CODE_NOT_VALID = "BACKUP_CODE_NOT_VALID",
}
export enum DashlaneAuthenticatorErrorCode {
  DASHLANE_AUTHENTICATOR_PUSH_NOTIFICATION_DENIED = "DASHLANE_AUTHENTICATOR_PUSH_NOTIFICATION_DENIED",
  TOKEN_EXPIRED = "TOKEN_EXPIRED",
}
export enum DefaultErrorCode {
  NETWORK_ERROR = "NETWORK_ERROR",
  UNKNOWN_ERROR = "UNKNOWN_ERROR",
}
export type IdentityVerificationErrorCode =
  | EmailTokenErrorCode
  | TotpErrorCode
  | DashlaneAuthenticatorErrorCode
  | DefaultErrorCode;
