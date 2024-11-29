import { Button, ClickOrigin, UserClickEvent } from "@dashlane/hermes";
import { SpaceTier } from "@dashlane/team-admin-contracts";
import useTranslate from "../../../../libs/i18n/useTranslate";
import { openUrl } from "../../../../libs/external-urls";
import { logEvent } from "../../../../libs/logs/logEvent";
import { redirect, useHistory } from "../../../../libs/router";
import { UseBuyOrUpgradePaywallDetailsResult } from "../../../helpers/use-buy-or-upgrade-paywall-details";
import { BUSINESS_BUY } from "../../../urls";
import { NamedRoutes } from "../../../../app/routes/types";
import { useIsStandard } from "../../../helpers/use-is-standard";
import { SettingFieldProps, SettingRowModel } from "../types";
import { PolicySettingRow } from "../components/policy-setting-row";
import { useFeatureFlip } from "@dashlane/framework-react";
const POLICIES_PAGE_BUY_DASHLANE_UTM_SOURCE =
  "button:buy_dashlane+click_origin:vpn_feature_activation_setting+origin_page:tac/settings/policies+origin_component:main_app";
const POST_TRIAL_CHECKOUT_FF = "monetization_extension_post_trial_checkout";
const I18N_KEYS = {
  TEAM_SETTINGS_TOO_MANY_REQUESTS: "team_settings_too_many_requests",
  TEAM_SETTINGS_AVAILABLE_IN_PAID_SUBSCRIPTION:
    "team_settings_available_in_paid_subscription_badge",
  TEAM_SETTINGS_UPGRADE: "team_settings_upgrade_badge",
  BUSINESS_SETTING_UPGRADE: "team_settings_available_in_business_plan",
  BUY_DASHLANE_CTA: "team_settings_buy_dashlane_cta",
  SEE_PLANS_CTA: "team_settings_see_plans_cta",
  TEAM_SETTINGS_VPN: "team_settings_vpn",
  TEAM_SETTINGS_VPN_HELPER: "team_settings_vpn_helper",
  TEAM_SETTINGS_VPN_DISABLED_FREE_TRIAL:
    "team_settings_vpn_disabled_for_free_trial",
  TEAM_SETTINGS_VPN_DISABLED_GENERIC_ERROR:
    "team_settings_vpn_save_error_msg_generic_error",
};
interface VPNSettingProps extends SettingFieldProps {
  hasExcludedPolicy: (policy: string) => boolean;
  hasTrialBusinessPaywall: boolean;
  routes: NamedRoutes;
  showPaywallInfo: UseBuyOrUpgradePaywallDetailsResult;
}
export const VPNSetting = (props: VPNSettingProps) => {
  const { translate } = useTranslate();
  const isStandardPlan = useIsStandard();
  const history = useHistory();
  const {
    hasExcludedPolicy,
    hasTrialBusinessPaywall,
    policies,
    routes,
    showPaywallInfo,
  } = props;
  const hasExcludedEnableVPNPolicy = hasExcludedPolicy("secureWifiEnabled");
  const hasPostTrialCheckoutFF = useFeatureFlip(POST_TRIAL_CHECKOUT_FF);
  const {
    shouldShowBuyOrUpgradePaywall,
    isTrialOrGracePeriod,
    accountSubscriptionCode,
    planType,
  } = showPaywallInfo;
  const showBuyDashlaneButton =
    !hasExcludedEnableVPNPolicy &&
    shouldShowBuyOrUpgradePaywall &&
    isTrialOrGracePeriod;
  const showSeePlansButton =
    !hasExcludedEnableVPNPolicy &&
    shouldShowBuyOrUpgradePaywall &&
    planType === "starter";
  const buyDashlaneLink = `${BUSINESS_BUY}?plan=${
    planType === SpaceTier.Team ? "team" : "business"
  }&subCode=${accountSubscriptionCode}&utm_source=${POLICIES_PAGE_BUY_DASHLANE_UTM_SOURCE}`;
  const handleBuyDashlane = () => {
    if (hasPostTrialCheckoutFF) {
      history.push(routes.teamAccountCheckoutRoutePath);
    } else {
      openUrl(buyDashlaneLink);
    }
  };
  let badgeLabel;
  let ctaAction;
  let ctaLabel;
  if (showBuyDashlaneButton) {
    badgeLabel = translate(
      I18N_KEYS.TEAM_SETTINGS_AVAILABLE_IN_PAID_SUBSCRIPTION
    );
    ctaAction = () => {
      logEvent(
        new UserClickEvent({
          button: Button.BuyDashlane,
          clickOrigin: ClickOrigin.VpnFeatureActivationSetting,
        })
      );
      handleBuyDashlane();
    };
    ctaLabel = translate(I18N_KEYS.BUY_DASHLANE_CTA);
  } else if (showSeePlansButton) {
    badgeLabel = translate(I18N_KEYS.TEAM_SETTINGS_UPGRADE);
    ctaAction = () => {
      logEvent(
        new UserClickEvent({
          button: Button.SeePlan,
          clickOrigin: ClickOrigin.VpnFeatureActivationSetting,
        })
      );
      redirect(`${routes.teamAccountChangePlanRoutePath}`);
    };
    ctaLabel = translate(I18N_KEYS.SEE_PLANS_CTA);
  } else if (
    hasExcludedEnableVPNPolicy ||
    hasTrialBusinessPaywall ||
    isStandardPlan
  ) {
    badgeLabel = translate(I18N_KEYS.BUSINESS_SETTING_UPGRADE);
  }
  if (!policies) {
    return null;
  }
  const vpnSettingRow: SettingRowModel = {
    type: showSeePlansButton || showBuyDashlaneButton ? "cta" : "switch",
    badgeIconName:
      showSeePlansButton ||
      showBuyDashlaneButton ||
      hasExcludedEnableVPNPolicy ||
      hasTrialBusinessPaywall ||
      isStandardPlan
        ? "PremiumOutlined"
        : undefined,
    badgeLabel,
    ctaAction,
    ctaLabel,
    isReadOnly: hasExcludedEnableVPNPolicy || isStandardPlan,
    label: translate(I18N_KEYS.TEAM_SETTINGS_VPN),
    helperLabel: translate(I18N_KEYS.TEAM_SETTINGS_VPN_HELPER),
    value: policies.enableVPN,
    feature: "enableVPN",
    getErrorMessageForKey: (key: string) => {
      switch (key) {
        case "too_many_requests":
          return translate(I18N_KEYS.TEAM_SETTINGS_TOO_MANY_REQUESTS);
        case "not_authorized":
          return translate(I18N_KEYS.TEAM_SETTINGS_VPN_DISABLED_FREE_TRIAL);
        default:
          return translate(I18N_KEYS.TEAM_SETTINGS_VPN_DISABLED_GENERIC_ERROR);
      }
    },
  };
  return <PolicySettingRow settingRow={vpnSettingRow} {...props} />;
};
