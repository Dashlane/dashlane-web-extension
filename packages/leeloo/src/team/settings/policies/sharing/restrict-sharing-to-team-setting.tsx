import { Policies } from "@dashlane/team-admin-contracts";
import { Button, ClickOrigin, UserClickEvent } from "@dashlane/hermes";
import useTranslate from "../../../../libs/i18n/useTranslate";
import { logEvent } from "../../../../libs/logs/logEvent";
import { openUrl } from "../../../../libs/external-urls";
import { redirect, useHistory } from "../../../../libs/router";
import { BUSINESS_BUY } from "../../../urls";
import { NamedRoutes } from "../../../../app/routes/types";
import { RestrictSharingPaywallDetails } from "../../../helpers/use-restrict-sharing-paywall";
import { useIsStandard } from "../../../helpers/use-is-standard";
import { PolicySettingRow } from "../components/policy-setting-row";
import { SettingFieldProps, SettingRowModel } from "../types";
import { useFeatureFlip } from "@dashlane/framework-react";
const I18N_KEYS_LABELS = {
  AVAILABLE_IN_BUSINESS_PLAN: "team_settings_available_in_business_plan",
  BUY_DASHLANE_CTA: "team_settings_buy_dashlane_cta",
  SEE_PLANS_CTA: "team_settings_see_plans_cta",
  RESTRICT_SHARING_TO_TEAM_LABEL:
    "team_settings_restrict_sharing_to_team_title",
  RESTRICT_SHARING_TO_TEAM_HELPER_LABEL:
    "team_settings_restrict_sharing_to_team_description",
};
const I18N_KEYS_ERRORS = {
  TEAM_SETTINGS_TOO_MANY_REQUESTS: "team_settings_too_many_requests",
  RESTRICT_SHARING_TO_TEAM_GENERIC_ERROR:
    "team_settings_restrict_sharing_to_team_generic_error",
  RESTRICT_SHARING_TO_TEAM_ENABLE_SHARING_FIRST:
    "team_settings_restrict_sharing_to_team_enable_sharing_first",
};
const POLICIES_PAGE_BUY_DASHLANE_UTM_SOURCE =
  "button:buy_dashlane+click_origin:restrict_sharing_to_team_activation_setting+origin_page:tac/settings/policies+origin_component:main_app";
const POST_TRIAL_CHECKOUT_FF = "monetization_extension_post_trial_checkout";
interface RestrictSharingToTeamSettingProps extends SettingFieldProps {
  isTeamDiscontinuedAfterTrial: boolean;
  restrictSharingPaywallDetails: RestrictSharingPaywallDetails;
  routes: NamedRoutes;
}
export const RestrictSharingToTeamSetting = (
  props: RestrictSharingToTeamSettingProps
) => {
  const { translate } = useTranslate();
  const isStandardPlan = useIsStandard();
  const history = useHistory();
  const hasPostTrialCheckoutFF = useFeatureFlip(POST_TRIAL_CHECKOUT_FF);
  const {
    isTeamDiscontinuedAfterTrial,
    policies,
    restrictSharingPaywallDetails,
    routes,
  } = props;
  if (!policies) {
    return null;
  }
  const {
    accountSubscriptionCode,
    shouldShowBuyPaywall,
    shouldShowUpgradePaywall,
  } = restrictSharingPaywallDetails;
  const buyDashlaneLink = `${BUSINESS_BUY}?plan=business&subCode=${accountSubscriptionCode}&utm_source=${POLICIES_PAGE_BUY_DASHLANE_UTM_SOURCE}`;
  const logPaywallClick = () =>
    logEvent(
      new UserClickEvent({
        button: Button.SeeB2bPlanTiers,
        clickOrigin: ClickOrigin.TacSettingsPolicies,
      })
    );
  const handleBuyDashlane = () => {
    if (hasPostTrialCheckoutFF) {
      history.push(routes.teamAccountCheckoutRoutePath);
    } else {
      openUrl(buyDashlaneLink);
    }
  };
  let ctaAction;
  let ctaLabel;
  if (shouldShowBuyPaywall) {
    ctaAction = () => {
      logPaywallClick();
      handleBuyDashlane();
    };
    ctaLabel = translate(I18N_KEYS_LABELS.BUY_DASHLANE_CTA);
  } else if (shouldShowUpgradePaywall) {
    ctaAction = () => {
      logPaywallClick();
      redirect(`${routes.teamAccountChangePlanRoutePath}`);
    };
    ctaLabel = translate(I18N_KEYS_LABELS.SEE_PLANS_CTA);
  }
  const shouldShowCtaOrSwitch =
    shouldShowBuyPaywall || shouldShowUpgradePaywall ? "cta" : "switch";
  const restrictSharingToTeamSettingRow: SettingRowModel = {
    type: isStandardPlan ? "switch" : shouldShowCtaOrSwitch,
    badgeIconName:
      shouldShowBuyPaywall || shouldShowUpgradePaywall || isStandardPlan
        ? "PremiumOutlined"
        : undefined,
    badgeLabel:
      shouldShowBuyPaywall || shouldShowUpgradePaywall || isStandardPlan
        ? translate(I18N_KEYS_LABELS.AVAILABLE_IN_BUSINESS_PLAN)
        : undefined,
    ctaAction,
    ctaLabel,
    isReadOnly: isTeamDiscontinuedAfterTrial || isStandardPlan,
    label: translate(I18N_KEYS_LABELS.RESTRICT_SHARING_TO_TEAM_LABEL),
    helperLabel: translate(
      I18N_KEYS_LABELS.RESTRICT_SHARING_TO_TEAM_HELPER_LABEL
    ),
    value: policies.restrictSharingToTeam,
    feature: "restrictSharingToTeam",
    getErrorMessageForKey: (key: string) => {
      switch (key) {
        case "too_many_requests":
          return translate(I18N_KEYS_ERRORS.TEAM_SETTINGS_TOO_MANY_REQUESTS);
        default:
          return translate(
            I18N_KEYS_ERRORS.RESTRICT_SHARING_TO_TEAM_GENERIC_ERROR
          );
      }
    },
    constraintsFromOtherFields: {
      disabledWhen: [
        {
          feature: "allowSharing",
          condition: (conditionPolicies: Policies) =>
            !conditionPolicies.allowSharing,
          warningMessage: translate(
            I18N_KEYS_ERRORS.RESTRICT_SHARING_TO_TEAM_ENABLE_SHARING_FIRST
          ),
        },
      ],
    },
  };
  return (
    <PolicySettingRow settingRow={restrictSharingToTeamSettingRow} {...props} />
  );
};
