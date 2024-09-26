export interface EmailTokenVerification {
  type: "email_token";
}
export interface TOTPVerification {
  type: "totp";
}
export interface DuoPushVerification {
  type: "duo_push";
}
export interface DashlaneAuthenticatorVerification {
  type: "dashlane_authenticator";
}
export interface U2FVerification {
  type: "u2f";
  challenges: U2FChallenge[];
}
export interface SSOLoginVerification {
  type: "sso";
  ssoInfo: {
    serviceProviderUrl: string;
    migration?:
      | "sso_member_to_admin"
      | "mp_user_to_sso_member"
      | "sso_member_to_mp_user";
    isNitroProvider?: boolean;
  };
}
export type VerificationMethod =
  | EmailTokenVerification
  | TOTPVerification
  | DuoPushVerification
  | U2FVerification
  | SSOLoginVerification
  | DashlaneAuthenticatorVerification;
export interface U2FChallenge {
  challenge: string;
  version: string;
  appId: string;
  keyHandle: string;
}
export enum RecoveryApiErrorType {
  CheckRecoveryStatusFailed = "CHECK_RECOVERY_STATUS_FAILED",
  RecoverySetupFailed = "RECOVERY_SETUP_FAILED",
  RecoveryDeactivationFailed = "RECOVERY_DEACTIVATION_FAILED",
  RecoveryRequestFailed = "RECOVERY_REQUEST_FAILED",
  RegisterDeviceFailed = "REGISTER_DEVICE_FAILED",
  SetupMasterPasswordForRecoveryFailed = "SETUP_MASTERPASSWORD_FOR_RECOVERY_FAILED",
  CancelRecoveryRequestFailed = "CANCEL_RECOVERY_REQUEST_FAILED",
  RecoverUserDataFailed = "RECOVER_REQUEST_FAILED",
  CheckLocalRecoveryKeyFailed = "CHECK_LOCAL_RECOVERY_KEY_FAILED",
  StartAccountRecoveryFailed = "START_ACCOUNT_RECOVERY_FAILED",
  AccountRecoveryNotAvailableError = "ACCOUNT_RECOVERY_NOT_AVAILABLE_ERROR",
  IsRecoveryRequestPendingFailed = "IS_RECOVERY_REQUEST_PENDING_FAILED",
}
export type AccountRecoveryNotAvailableError = {
  success: false;
  error: {
    code: RecoveryApiErrorType.AccountRecoveryNotAvailableError;
  };
};
export type StartAccountRecoveryResult =
  | StartAccountRecoverySuccess
  | StartAccountRecoveryError
  | AccountRecoveryNotAvailableError;
interface StartAccountRecoverySuccess {
  success: true;
  verification: Array<VerificationMethod>;
}
interface StartAccountRecoveryError {
  success: false;
  error: {
    code: RecoveryApiErrorType.StartAccountRecoveryFailed;
    message: string;
  };
}
export interface StartAccountRecoveryParam {
  login: string;
}
export type ActivateAccountRecoveryResult =
  | ActivateAccountRecoverySuccess
  | ActivateAccountRecoveryError
  | AccountRecoveryNotAvailableError;
interface ActivateAccountRecoverySuccess {
  success: true;
}
interface ActivateAccountRecoveryError {
  success: false;
  error: {
    code: RecoveryApiErrorType.RecoverySetupFailed;
    message: string;
  };
}
export interface RecoverUserDataParam {
  masterPassword: string;
}
interface RecoverUserDataSuccess {
  success: true;
}
export interface RecoverUserDataError {
  success: false;
  error: {
    code: RecoveryApiErrorType;
    message: string;
  };
}
export type CheckLocalRecoveryKeyResult =
  | CheckLocalRecoveryKeySuccess
  | CheckLocalRecoveryKeyError;
interface CheckLocalRecoveryKeySuccess {
  success: true;
  doesExist: boolean;
}
interface CheckLocalRecoveryKeyError {
  success: false;
  error: {
    code: RecoveryApiErrorType.CheckLocalRecoveryKeyFailed;
    message: string;
  };
}
export type RecoverUserDataResult =
  | RecoverUserDataSuccess
  | RecoverUserDataError
  | AccountRecoveryNotAvailableError;
export type DeactivateAccountRecoveryResult =
  | DeactivateAccountRecoverySuccess
  | DeactivateAccountRecoveryError
  | AccountRecoveryNotAvailableError;
interface DeactivateAccountRecoverySuccess {
  success: true;
}
interface DeactivateAccountRecoveryError {
  success: false;
  error: {
    code: RecoveryApiErrorType.RecoveryDeactivationFailed;
    message: string;
  };
}
export type RegisterDeviceForRecoveryResult =
  | RegisterDeviceForRecoverySuccess
  | RegisterDeviceForRecoveryError
  | AccountRecoveryNotAvailableError;
interface RegisterDeviceForRecoverySuccess {
  success: true;
}
interface RegisterDeviceForRecoveryError {
  success: false;
  error: {
    code: RecoveryApiErrorType.RegisterDeviceFailed;
    message: string;
  };
}
export type SendRecoveryRequestResult =
  | SendRecoveryRequestSuccess
  | SendRecoveryRequestError
  | AccountRecoveryNotAvailableError;
interface SendRecoveryRequestSuccess {
  success: true;
}
interface SendRecoveryRequestError {
  success: false;
  error: {
    code: RecoveryApiErrorType.RecoveryRequestFailed;
    message: string;
  };
}
export type CancelRecoveryRequestResult =
  | CancelRecoveryRequestSuccess
  | CancelRecoveryRequestError
  | AccountRecoveryNotAvailableError;
interface CancelRecoveryRequestSuccess {
  success: true;
}
interface CancelRecoveryRequestError {
  success: false;
  error: {
    code: RecoveryApiErrorType.CancelRecoveryRequestFailed;
    message: string;
  };
}
export interface RegisterDeviceForRecoveryParam {
  token: string;
  login: string;
}
export interface SetupMasterPasswordForRecoveryParam {
  masterPassword: string;
}
export type SetupMasterPasswordForRecoveryResult =
  | SetupMasterPasswordForRecoverySuccess
  | SetupMasterPasswordForRecoveryError
  | AccountRecoveryNotAvailableError;
export interface SetupMasterPasswordForRecoverySuccess {
  success: true;
}
export interface SetupMasterPasswordForRecoveryError {
  success: false;
  error: {
    code: RecoveryApiErrorType.SetupMasterPasswordForRecoveryFailed;
    message: string;
  };
}
export interface CheckRecoveryRequestStatusParams {
  masterPassword: string;
}
export type CheckRecoveryRequestStatusResult =
  | CheckRecoveryRequestStatusSuccess
  | CheckRecoveryRequestStatusError
  | AccountRecoveryNotAvailableError;
export enum RequestStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REFUSED = "REFUSED",
  OVERRIDDEN = "OVERRIDDEN",
  CANCELED = "CANCELED",
}
interface CheckRecoveryRequestStatusSuccess {
  success: true;
  response: {
    status: RequestStatus;
    payload?: string;
    recoveryServerKey?: string;
  };
}
interface CheckRecoveryRequestStatusError {
  success: false;
  error: {
    code: RecoveryApiErrorType.CheckRecoveryStatusFailed;
    message: string;
  };
}
export interface RecoverySessionCredential {
  masterPassword: string | null;
  recoveryKey: string | null;
}
interface IsRecoveryRequestPendingSuccess {
  success: true;
  response: boolean;
}
interface IsRecoveryRequestPendingError {
  success: false;
  error: {
    code: RecoveryApiErrorType.IsRecoveryRequestPendingFailed;
    message: string;
  };
}
export type IsRecoveryRequestPendingResult =
  | IsRecoveryRequestPendingSuccess
  | IsRecoveryRequestPendingError;
