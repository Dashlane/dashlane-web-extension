import { IconName } from "@dashlane/design-system";
import { SubscriptionPhases } from "../plan-information/helpers";
export type SideContentType =
  | "cancelSubscription"
  | "trialUpgrade"
  | "keepSubscription";
export const getSideContentType = (
  subscriptionPhase: SubscriptionPhases
): SideContentType => {
  switch (subscriptionPhase) {
    case "ACTIVE":
    case "ACTIVE CARD EXPIRED":
    case "DISCONTINUED CARD EXPIRED":
      return "cancelSubscription";
    case "ACTIVE CANCELED":
    case "DISCONTINUED CANCELED":
      return "keepSubscription";
    case "DISCONTINUED TRIAL":
    case "GRACE PERIOD":
    case "TRIAL":
      return "trialUpgrade";
  }
};
const I18N_KEYS = {
  SSO_FEATURE: "account_summary_sso_description",
  UNLIMITED_SEATS: "account_summary_unlimited_seats_description",
  UNLIMITED_GROUPS: "account_summary_unlimited_groups_description",
  ACTIVITY_LOGS: "account_summary_activity_logs_description",
  SCIM: "account_summary_scim_feature_description",
  FAMILY_FRIENDS_PLAN: "account_summary_family_friends_plan_description",
  PHONE_SUPPORT_FEATURE: "account_summary_phone_support_team_description",
  ADVANCED_TOOLS: "account_summary_advanced_tools_description",
  ENHANCED_INTEGRATIONS: "account_summary_enhanced_integrations_description",
  ADDITIONAL_SUPPORT: "account_summary_additional_support_description",
};
interface FeatureLineType {
  icon: IconName;
  description: string;
}
export const getFeatureLines = (
  plan: "starter" | "team" | "standard"
): FeatureLineType[] => {
  switch (plan) {
    case "starter":
      return [
        { icon: "GroupOutlined", description: I18N_KEYS.UNLIMITED_SEATS },
        { icon: "SharedOutlined", description: I18N_KEYS.UNLIMITED_GROUPS },
        { icon: "LockOutlined", description: I18N_KEYS.SSO_FEATURE },
        { icon: "SettingsOutlined", description: I18N_KEYS.ACTIVITY_LOGS },
      ];
    case "team":
      return [
        { icon: "LockOutlined", description: I18N_KEYS.SSO_FEATURE },
        { icon: "SharedOutlined", description: I18N_KEYS.SCIM },
        { icon: "GroupOutlined", description: I18N_KEYS.FAMILY_FRIENDS_PLAN },
        {
          icon: "ItemPhoneHomeOutlined",
          description: I18N_KEYS.PHONE_SUPPORT_FEATURE,
        },
      ];
    case "standard":
      return [
        { icon: "GroupOutlined", description: I18N_KEYS.UNLIMITED_SEATS },
        { icon: "ToolsOutlined", description: I18N_KEYS.ADVANCED_TOOLS },
        {
          icon: "HealthPositiveOutlined",
          description: I18N_KEYS.ENHANCED_INTEGRATIONS,
        },
        {
          icon: "ItemPhoneHomeOutlined",
          description: I18N_KEYS.ADDITIONAL_SUPPORT,
        },
      ];
  }
};
