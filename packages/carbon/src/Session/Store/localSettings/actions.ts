import {
  CredentialSearchOrder,
  NodePremiumStatus,
  PremiumStatus,
  SubscriptionInformation,
  WebOnboardingModeEvent,
} from "@dashlane/communication";
import { LocalSettings } from "Session/Store/localSettings/types";
import { UserMessagesDismissedAction } from "UserMessages/Store/actions";
import { Action } from "Store";
export const LOAD_STORED_LOCAL_SETTINGS =
  "LOCAL_SETTINGS/LOAD_STORED_LOCAL_SETTINGS";
export const REGISTER_LAST_SYNC = "LOCAL_SETTINGS/REGISTER_LAST_SYNC";
export const REGISTER_DEVICE_NAME = "LOCAL_SETTINGS/REGISTER_DEVICE_NAME";
export const PREMIUM_STATUS_UPDATED = "LOCAL_SETTINGS/PREMIUM_STATUS_UPDATED";
export const NODE_PREMIUM_STATUS_UPDATED =
  "LOCAL_SETTINGS/NODE_PREMIUM_STATUS_UPDATED";
export const SUBSCRIPTION_INFORMATION_UPDATED =
  "LOCAL_SETTINGS/SUBSCRIPTION_INFORMATION_UPDATED";
export const WEB_ONBOARDING_MODE_UPDATED =
  "LOCAL_SETTINGS/WEB_ONBOARDING_MODE_UPDATED";
export const WEB_ONBOARDING_MODE_RESET =
  "LOCAL_SETTINGS/WEB_ONBOARDING_MODE_RESET";
export const PREMIUM_CHURNING_DISMISS_DATE_UPDATED =
  "PREMIUM_CHURNING_DISMISS_DATE_UPDATED";
export const CREDENTIAL_SEARCH_ORDER_UPDATED =
  "CREDENTIAL_SEARCH_ORDER_UPDATED";
export interface DeviceNameRegisteredAction extends Action {
  type: typeof REGISTER_DEVICE_NAME;
  deviceName: string;
}
export interface LastSyncRegisteredAction extends Action {
  type: typeof REGISTER_LAST_SYNC;
  lastSync: number;
}
export interface LocalSettingsLoadedAction extends Action {
  type: typeof LOAD_STORED_LOCAL_SETTINGS;
  data: Partial<LocalSettings>;
}
export interface LocalSettingsPremiumStatusUpdatedAction extends Action {
  type: typeof PREMIUM_STATUS_UPDATED;
  premiumStatus: PremiumStatus;
}
export interface LocalSettingsNodePremiumStatusUpdatedAction extends Action {
  type: typeof NODE_PREMIUM_STATUS_UPDATED;
  nodePremiumStatus: NodePremiumStatus;
}
export interface LocalSettingsSubscriptionInformationUpdatedAction
  extends Action {
  type: typeof SUBSCRIPTION_INFORMATION_UPDATED;
  subscriptionInformation: SubscriptionInformation;
}
export interface WebOnboardingModeUpdatedAction extends Action {
  type: typeof WEB_ONBOARDING_MODE_UPDATED;
  webOnboardingMode: WebOnboardingModeEvent;
}
export interface PremiumChurningDismissDateUpdatedAction extends Action {
  type: typeof PREMIUM_CHURNING_DISMISS_DATE_UPDATED;
  premiumChurningDismissDate: number;
}
export interface CredentialSearchOrderUpdatedAction extends Action {
  type: typeof CREDENTIAL_SEARCH_ORDER_UPDATED;
  credentialSearchOrder: CredentialSearchOrder;
}
export type LocalSettingsAction =
  | DeviceNameRegisteredAction
  | LastSyncRegisteredAction
  | LocalSettingsLoadedAction
  | LocalSettingsPremiumStatusUpdatedAction
  | LocalSettingsNodePremiumStatusUpdatedAction
  | LocalSettingsSubscriptionInformationUpdatedAction
  | WebOnboardingModeUpdatedAction
  | PremiumChurningDismissDateUpdatedAction
  | CredentialSearchOrderUpdatedAction
  | UserMessagesDismissedAction;
export const loadStoredLocalSettings = (
  localSettings: LocalSettings
): LocalSettingsLoadedAction => ({
  type: LOAD_STORED_LOCAL_SETTINGS,
  data: Object.assign({}, localSettings),
});
export const registerLastSync = (
  lastSync: number
): LastSyncRegisteredAction => ({
  type: REGISTER_LAST_SYNC,
  lastSync,
});
export const registerDeviceName = (
  deviceName: string
): DeviceNameRegisteredAction => ({
  type: REGISTER_DEVICE_NAME,
  deviceName,
});
export const localSettingsPremiumStatusUpdated = (
  premiumStatus: PremiumStatus
): LocalSettingsPremiumStatusUpdatedAction => ({
  type: PREMIUM_STATUS_UPDATED,
  premiumStatus,
});
export const localSettingsNodePremiumStatusUpdated = (
  nodePremiumStatus: NodePremiumStatus
): LocalSettingsNodePremiumStatusUpdatedAction => ({
  type: NODE_PREMIUM_STATUS_UPDATED,
  nodePremiumStatus,
});
export const localSettingsSubscriptionInformationStatusUpdated = (
  subscriptionInformation: SubscriptionInformation
): LocalSettingsSubscriptionInformationUpdatedAction => ({
  type: SUBSCRIPTION_INFORMATION_UPDATED,
  subscriptionInformation,
});
export const webOnboardingModeUpdated = (
  webOnboardingMode: WebOnboardingModeEvent
): WebOnboardingModeUpdatedAction => ({
  type: WEB_ONBOARDING_MODE_UPDATED,
  webOnboardingMode,
});
export const premiumChurningDismissDateUpdated = (
  premiumChurningDismissDate: number
): PremiumChurningDismissDateUpdatedAction => ({
  type: PREMIUM_CHURNING_DISMISS_DATE_UPDATED,
  premiumChurningDismissDate,
});
export const credentialSearchOrderUpdated = (
  credentialSearchOrder: CredentialSearchOrder
): CredentialSearchOrderUpdatedAction => ({
  type: CREDENTIAL_SEARCH_ORDER_UPDATED,
  credentialSearchOrder,
});
