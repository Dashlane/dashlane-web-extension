export enum UserMessageTypes {
  DEFAULT = "default",
  TRIAL_EXPIRED = "trial_expired",
  WEB_STORE = "web_store",
  DASHBOARD_UPRADE = "dashboard_upgrade",
  SHARING_CENTER_FAMILY = "sharing_center_family",
  SHARING_CENTER_WORK = "sharing_center_work",
}
export interface UserMessageContent {
  title: string;
  content: string;
}
export interface TrialExpiredUserMessage {
  type: UserMessageTypes.TRIAL_EXPIRED;
  dismissedAt?: number;
}
export interface WebStoreUserMessage {
  type: UserMessageTypes.WEB_STORE;
  dismissedAt?: number;
}
export interface DashboardUpgradeUserMessage {
  type: UserMessageTypes.DASHBOARD_UPRADE;
  dismissedAt?: number;
}
export interface SharingCenterFamilyUserMessage {
  type: UserMessageTypes.SHARING_CENTER_FAMILY;
  dismissedAt?: number;
}
export interface SharingCenterWorkUserMessage {
  type: UserMessageTypes.SHARING_CENTER_WORK;
  dismissedAt?: number;
}
export interface DefaultUserMessage {
  type: UserMessageTypes.DEFAULT;
  content?: UserMessageContent;
  dismissedAt?: number;
}
export type UserMessage =
  | TrialExpiredUserMessage
  | WebStoreUserMessage
  | DashboardUpgradeUserMessage
  | SharingCenterFamilyUserMessage
  | SharingCenterWorkUserMessage
  | DefaultUserMessage;
export interface DismissUserMessagesRequest {
  type: string;
}
export interface AddUserMessageRequest {
  type: string;
}
