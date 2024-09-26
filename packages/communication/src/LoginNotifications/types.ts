export enum LoginNotificationType {
  RELOGIN_NEEDED = "RELOGIN_NEEDED",
  SSO_FEATURE_BLOCKED = "SSO_FEATURE_BLOCKED",
  SSO_LOGIN_CORRUPT = "SSO_LOGIN_CORRUPT",
  SSO_SETUP_ERROR = "SSO_SETUP_ERROR",
  UNKNOWN_ERROR = "UNKNOWN_ERROR",
  TEAM_ACCEPTANCE_SUCCESS = "TEAM_ACCEPTANCE_SUCCESS",
  TEAM_ACCEPTANCE_ERROR = "TEAM_ACCEPTANCE_ERROR",
}
export interface LoginNotification {
  type: LoginNotificationType;
  message?: string;
}
export interface ClearAllStoredLoginNotificationError {
  success: false;
}
export interface ClearAllStoredLoginNotificationSuccess {
  success: true;
}
export type ClearAllStoredLoginNotificationResult =
  | ClearAllStoredLoginNotificationSuccess
  | ClearAllStoredLoginNotificationError;
