import { SpaceTier } from "@dashlane/team-admin-contracts";
import { useSubscriptionCode } from "../../libs/hooks/use-subscription-code";
import { useTeamTrialStatus } from "../../libs/hooks/use-team-trial-status";
import { useRouterGlobalSettingsContext } from "../../libs/router";
import { BUSINESS_BUY } from "../urls";
import { UpgradePlanData } from "./types";
import { DataStatus, useFeatureFlips } from "@dashlane/framework-react";
const I18N_KEYS = {
  TEAM_TRIAL_HEADER: "team_dashboard_upgrade_tile_team_trial_header_markup",
  TEAM_TRIAL_HEADER_LAST_DAY:
    "team_dashboard_upgrade_tile_team_trial_header_last_day",
  TEAM_TRIAL_DESCRIPTION:
    "team_dashboard_upgrade_tile_business_trial_description",
  TEAM_UPGRADE_HEADER: "team_dashboard_upgrade_tile_team_upgrade_header",
  TEAM_UPGRADE_DESCRIPTION:
    "team_dashboard_upgrade_tile_team_upgrade_description",
  BUSINESS_TRIAL_HEADER:
    "team_dashboard_upgrade_tile_business_trial_header_markup",
  BUSINESS_TRIAL_HEADER_LAST_DAY:
    "team_dashboard_upgrade_tile_business_trial_header_last_day",
  BUSINESS_TRIAL_DESCRIPTION:
    "team_dashboard_upgrade_tile_business_trial_description",
  BUSINESS_UPGRADE_HEADER:
    "team_dashboard_upgrade_tile_business_upgrade_header",
  BUSINESS_UPGRADE_DESCRIPTION:
    "team_dashboard_upgrade_tile_business_upgrade_description",
  UNLIMITED_SEATS: "team_dashboard_upgrade_tile_feature_unlimited_seats",
  VPN: "team_dashboard_upgrade_tile_feature_vpn",
  BUY_CTA: "team_dashboard_upgrade_tile_cta_buy_dashlane",
  UPGRADE_CTA: "team_dashboard_upgrade_tile_cta_upgrade",
  SSO: "team_dashboard_upgrade_tile_feature_sso",
  SCIM: "team_dashboard_upgrade_tile_feature_scim",
  FAMILY: "team_dashboard_upgrade_tile_feature_friends_and_family",
  SUPPORT: "team_dashboard_upgrade_tile_feature_support",
  GROUP: "team_dashboard_upgrade_tile_feature_group",
  ACTIVITY_LOGS: "team_dashboard_upgrade_tile_feature_activity_logs",
  UPGRADE_TO_BUSINESS_CTA: "team_upgrade_to_business",
  SEATS: "account_summary_unlimited_seats_description",
  PROVISIONING: "team_dashboard_upgrade_tile_feature_provisioning",
  INTEGRATIONS: "team_dashboard_upgrade_tile_feature_integrations",
  ADDITIONAL_SUPPORT: "team_dashboard_upgrade_tile_feature_additional_support",
  STANDARD_UPGRADE_TO_BUSINESS_DESCRIPTION:
    "account_summary_upgrade_standard_title",
};
export const useUpgradeData = (): UpgradePlanData | null => {
  const subscriptionCode = useSubscriptionCode();
  const { routes } = useRouterGlobalSettingsContext();
  const teamTrialStatus = useTeamTrialStatus();
  const featureFlipsResult = useFeatureFlips();
  const isPostTrialCheckoutEnabled =
    featureFlipsResult.status === DataStatus.Success &&
    featureFlipsResult.data["monetization_extension_post_trial_checkout"];
  if (!teamTrialStatus) {
    return null;
  }
  const isTrial = teamTrialStatus.isFreeTrial;
  const isStarter = teamTrialStatus.spaceTier === SpaceTier.Starter;
  const isTeam = teamTrialStatus.spaceTier === SpaceTier.Team;
  const isBusiness = teamTrialStatus.spaceTier === SpaceTier.Business;
  const isStandardPlan = teamTrialStatus.spaceTier === SpaceTier.Standard;
  const daysLeft = teamTrialStatus.daysLeftInTrial;
  if (isTrial && isTeam) {
    return {
      header: {
        key: !daysLeft
          ? I18N_KEYS.TEAM_TRIAL_HEADER_LAST_DAY
          : I18N_KEYS.TEAM_TRIAL_HEADER,
        variables: { daysLeft },
      },
      description: {
        key: I18N_KEYS.TEAM_TRIAL_DESCRIPTION,
      },
      features: [
        {
          iconName: "GroupOutlined",
          key: I18N_KEYS.UNLIMITED_SEATS,
        },
        {
          iconName: "FeatureVpnOutlined",
          key: I18N_KEYS.VPN,
        },
      ],
      cta: {
        key: I18N_KEYS.BUY_CTA,
        external: !isPostTrialCheckoutEnabled,
        link: isPostTrialCheckoutEnabled
          ? routes.teamAccountCheckoutRoutePath
          : `${BUSINESS_BUY}?plan=team&subCode=${subscriptionCode ?? ""}`,
      },
    };
  }
  if (isTrial && isBusiness) {
    return {
      header: {
        key: !daysLeft
          ? I18N_KEYS.BUSINESS_TRIAL_HEADER_LAST_DAY
          : I18N_KEYS.BUSINESS_TRIAL_HEADER,
        variables: { daysLeft },
      },
      description: {
        key: I18N_KEYS.BUSINESS_TRIAL_DESCRIPTION,
      },
      features: [
        {
          iconName: "ToolsOutlined",
          key: I18N_KEYS.SSO,
        },
        {
          iconName: "SharedOutlined",
          key: I18N_KEYS.SCIM,
        },
        {
          iconName: "GroupOutlined",
          key: I18N_KEYS.FAMILY,
        },
        {
          iconName: "ItemPhoneHomeOutlined",
          key: I18N_KEYS.SUPPORT,
        },
      ],
      cta: {
        key: I18N_KEYS.BUY_CTA,
        external: !isPostTrialCheckoutEnabled,
        link: isPostTrialCheckoutEnabled
          ? routes.teamAccountCheckoutRoutePath
          : `${BUSINESS_BUY}?plan=team&subCode=${subscriptionCode ?? ""}`,
      },
    };
  }
  if (!isTrial && isStarter) {
    return {
      header: {
        key: I18N_KEYS.BUSINESS_UPGRADE_HEADER,
      },
      description: {
        key: I18N_KEYS.TEAM_UPGRADE_DESCRIPTION,
      },
      features: [
        {
          iconName: "GroupOutlined",
          key: I18N_KEYS.UNLIMITED_SEATS,
        },
        {
          iconName: "SharedOutlined",
          key: I18N_KEYS.GROUP,
        },
        {
          iconName: "LockOutlined",
          key: I18N_KEYS.SSO,
        },
        {
          iconName: "SettingsOutlined",
          key: I18N_KEYS.ACTIVITY_LOGS,
        },
      ],
      cta: {
        key: I18N_KEYS.UPGRADE_TO_BUSINESS_CTA,
        link: routes.teamAccountChangePlanRoutePath,
      },
    };
  }
  if (!isTrial && isTeam) {
    return {
      header: {
        key: I18N_KEYS.BUSINESS_UPGRADE_HEADER,
      },
      description: {
        key: I18N_KEYS.BUSINESS_UPGRADE_DESCRIPTION,
      },
      features: [
        {
          iconName: "ToolsOutlined",
          key: I18N_KEYS.SSO,
        },
        {
          iconName: "SharedOutlined",
          key: I18N_KEYS.SCIM,
        },
        {
          iconName: "GroupOutlined",
          key: I18N_KEYS.FAMILY,
        },
        {
          iconName: "ItemPhoneHomeOutlined",
          key: I18N_KEYS.SUPPORT,
        },
      ],
      cta: {
        key: I18N_KEYS.UPGRADE_CTA,
        link: routes.teamAccountChangePlanRoutePath,
      },
    };
  }
  if (!isTrial && isStandardPlan) {
    return {
      header: {
        key: I18N_KEYS.BUSINESS_UPGRADE_HEADER,
      },
      description: {
        key: I18N_KEYS.STANDARD_UPGRADE_TO_BUSINESS_DESCRIPTION,
      },
      features: [
        {
          iconName: "GroupOutlined",
          key: I18N_KEYS.SEATS,
        },
        {
          iconName: "ToolsOutlined",
          key: I18N_KEYS.PROVISIONING,
        },
        {
          iconName: "HealthPositiveOutlined",
          key: I18N_KEYS.INTEGRATIONS,
        },
        {
          iconName: "ItemPhoneHomeOutlined",
          key: I18N_KEYS.ADDITIONAL_SUPPORT,
        },
      ],
      cta: {
        key: I18N_KEYS.UPGRADE_TO_BUSINESS_CTA,
        link: routes.teamAccountChangePlanRoutePath,
      },
    };
  }
  return null;
};
