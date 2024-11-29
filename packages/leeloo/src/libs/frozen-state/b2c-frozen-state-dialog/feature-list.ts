import { IconName } from "@dashlane/design-system";
import { TranslateFunction } from "../../i18n/types";
const I18N_KEYS = {
  FREE_PLAN_FEATURES_PWD_LIMIT: "webapp_frozen_state_free_features_pwd_limit",
  FREE_PLAN_FEATURES_DEVICE: "webapp_frozen_state_free_features_device",
  FREE_PLAN_FEATURES_SECURE_NOTES_STORAGE:
    "webapp_frozen_state_free_features_secure_notes",
  FREE_PLAN_FEATURES_STORAGE: "webapp_frozen_state_free_features_storage",
  FREE_PLAN_FEATURES_SHARING: "webapp_frozen_state_free_features_sharing",
  PREMIUM_FEATURES_EVERYTHING_IN:
    "webapp_frozen_state_premium_features_everything_in",
  PREMIUM_FEATURES_UNLIMITED_PWD:
    "webapp_frozen_state_premium_features_unlimited_pwd",
  PREMIUM_FEATURES_DEVICES: "webapp_frozen_state_premium_features_devices",
  PREMIUM_FEATURES_DWM: "webapp_frozen_state_premium_features_dwm",
  PREMIUM_FEATURES_VPN: "webapp_frozen_state_premium_features_vpn",
  PREMIUM_FEATURES_PHISHING: "webapp_frozen_state_premium_features_phishing",
  FAMILY_FRIENDS_FEATURES_ADMIN:
    "webapp_frozen_state_family_friends_features_admin",
  FAMILY_FRIENDS_FEATURES_MEMBERS:
    "webapp_frozen_state_family_friends_features_members",
};
type FeatureList = {
  label: string;
  icon: IconName;
}[];
export const getFreeFeatureList = (
  translate: TranslateFunction
): FeatureList => {
  return [
    {
      label: translate(I18N_KEYS.FREE_PLAN_FEATURES_PWD_LIMIT),
      icon: "CheckmarkOutlined",
    },
    {
      label: translate(I18N_KEYS.FREE_PLAN_FEATURES_DEVICE),
      icon: "CheckmarkOutlined",
    },
    {
      label: translate(I18N_KEYS.FREE_PLAN_FEATURES_SECURE_NOTES_STORAGE),
      icon: "CheckmarkOutlined",
    },
    {
      label: translate(I18N_KEYS.FREE_PLAN_FEATURES_STORAGE),
      icon: "CheckmarkOutlined",
    },
    {
      label: translate(I18N_KEYS.FREE_PLAN_FEATURES_SHARING),
      icon: "CheckmarkOutlined",
    },
  ];
};
export const getPremiumFeatureList = (
  translate: TranslateFunction
): FeatureList => {
  return [
    {
      label: translate(I18N_KEYS.PREMIUM_FEATURES_EVERYTHING_IN),
      icon: "CheckmarkOutlined",
    },
    {
      label: translate(I18N_KEYS.PREMIUM_FEATURES_UNLIMITED_PWD),
      icon: "ActionAddOutlined",
    },
    {
      label: translate(I18N_KEYS.PREMIUM_FEATURES_DEVICES),
      icon: "ActionAddOutlined",
    },
    {
      label: translate(I18N_KEYS.PREMIUM_FEATURES_DWM),
      icon: "ActionAddOutlined",
    },
    {
      label: translate(I18N_KEYS.PREMIUM_FEATURES_VPN),
      icon: "ActionAddOutlined",
    },
    {
      label: translate(I18N_KEYS.PREMIUM_FEATURES_PHISHING),
      icon: "ActionAddOutlined",
    },
  ];
};
export const getFamilyFeatureList = (
  translate: TranslateFunction
): FeatureList => {
  return [
    {
      label: translate(I18N_KEYS.FAMILY_FRIENDS_FEATURES_ADMIN),
      icon: "CheckmarkOutlined",
    },
    {
      label: translate(I18N_KEYS.FAMILY_FRIENDS_FEATURES_MEMBERS),
      icon: "ActionAddOutlined",
    },
  ];
};
