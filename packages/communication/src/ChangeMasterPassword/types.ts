export enum ChangeMPFlowPath {
  USER_CHANGING_MP = "USER_CHANGING_MP",
  MP_TO_SSO = "MP_TO_SSO",
  SSO_TO_MP = "SSO_TO_MP",
  TO_EMAIL_TOKEN = "EMAIL_TOKEN",
  ADMIN_ASSISTED_RECOVERY = "ADMIN_ASSISTED_RECOVERY",
  ACCOUNT_RECOVERY_KEY = "ACCOUNT_RECOVERY_KEY",
}
export interface MigrationMPToSso {
  newPassword: string;
  flow: ChangeMPFlowPath.MP_TO_SSO;
}
export interface MigrationSsoToMP {
  newPassword: string;
  flow: ChangeMPFlowPath.SSO_TO_MP;
}
export interface MigrationToEmailToken {
  newPassword: string;
  currentPassword: string;
  flow: ChangeMPFlowPath.TO_EMAIL_TOKEN;
}
export interface MigrationWithAdminAssistedRecovery {
  newPassword: string;
  flow: ChangeMPFlowPath.ADMIN_ASSISTED_RECOVERY;
}
export interface ChangeMasterPasswordBase {
  newPassword: string;
  currentPassword: string;
  flow: ChangeMPFlowPath.USER_CHANGING_MP;
}
export interface MigrationWithAccountRecoveryKey
  extends Omit<ChangeMasterPasswordBase, "flow"> {
  flow: ChangeMPFlowPath.ACCOUNT_RECOVERY_KEY;
}
export type ChangeMasterPasswordParams =
  | ChangeMasterPasswordBase
  | MigrationSsoToMP
  | MigrationMPToSso
  | MigrationToEmailToken
  | MigrationWithAdminAssistedRecovery
  | MigrationWithAccountRecoveryKey;
export type ChangeMasterPasswordResponse =
  | ChangeMasterPasswordSuccess
  | ChangeMasterPasswordError
  | ChangeMasterPasswordUnexpectedError;
export enum ChangeMasterPasswordCode {
  FEATURE_BLOCKED = "feature_blocked",
  INNACTIVE_SESSION = "inactive_session",
  INVALID_TOKEN = "invalid_token",
  OTP_PROBLEM = "otp_problem",
  MP_ERROR = "mp_error",
  MP_STRENGTH_ERROR = "mp_strength_error",
  SUCCESS = "success",
  SYNC_PROGRESS = "sync_in_progress",
  UNKNOWN_ERROR = "unknown_error",
  WRONG_PASSWORD = "wrong_password",
  UNEXPECTED_STATE = "unexpected_state",
}
type ChangeMasterPasswordSuccess = {
  success: true;
  response: {
    reason: ChangeMasterPasswordCode;
  };
};
export type ChangeMasterPasswordUnexpectedError = {
  success: false;
  error: {
    code: ChangeMasterPasswordCode.UNKNOWN_ERROR;
    message: string;
  };
};
export type ChangeMasterPasswordError = {
  success: false;
  error: {
    code: ChangeMasterPasswordCode;
  };
};
export enum ChangeMasterPasswordStepNeeded {
  DOWNLOAD = "download",
  DECRYPTING = "decrypting",
  ENCRYPTING = "encrypting",
  UPLOADING = "uploading",
  DONE = "done",
  ERROR = "error",
}
export type ChangeMasterPasswordProgress = {
  type: ChangeMasterPasswordStepNeeded;
  value: number;
};
