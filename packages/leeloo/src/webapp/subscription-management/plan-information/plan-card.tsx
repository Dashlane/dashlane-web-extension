import { differenceInDays } from "date-fns";
import { DataStatus } from "@dashlane/carbon-api-consumers";
import { AutoRenewInfo, SpaceTiers } from "@dashlane/communication";
import { CallToAction } from "@dashlane/hermes";
import {
  Button,
  Card,
  Flex,
  Heading,
  IndeterminateLoader,
  LinkButton,
  Paragraph,
} from "@dashlane/design-system";
import { APP_STORE_PLANS, GOOGLE_PLAY_PLANS } from "../../../team/urls";
import { useSubscriptionCode } from "../../../libs/hooks/use-subscription-code";
import {
  getActiveSpace,
  getPlanNameFromTier,
} from "../../../libs/account/helpers";
import { usePremiumStatus } from "../../../libs/carbon/hooks/usePremiumStatus";
import { openDashlaneUrl } from "../../../libs/external-urls";
import { getPlanRenewalPeriodicity } from "../../../libs/premium-status.lib";
import { useRouterGlobalSettingsContext } from "../../../libs/router/RouterGlobalSettingsProvider";
import useTranslate from "../../../libs/i18n/useTranslate";
import { NamedRoutes } from "../../../app/routes/types";
import { CancellationStep } from "../types";
import { logPlanRestartEvent, logPlansPageEvent } from "../logs";
import {
  formatRenewalDate,
  getPlanTypes,
  I8N_KEYS_PLAN_NAMES,
} from "./helpers";
const I18N_KEYS = {
  BUY_AS_TRIAL: "manage_subscription_plan_section_buy_as_trial_button",
  CARD_TITLE: "manage_subscription_plan_section_title",
  CHANGE_PLAN: "manage_subscription_plan_section_change_button",
  DESC_B2C: "manage_subscription_plan_section_desc_b2c_plans_markup",
  DESC_BUSINESS: "manage_subscription_plan_section_desc_business",
  DESC_BUSINESS_PLUS: "manage_subscription_plan_section_desc_business_plus",
  DESC_CANCELLED: "manage_subscription_plan_section_desc_cancelled_markup",
  DESC_FAMILY_INVITEE: "manage_subscription_plan_section_desc_family_invitee",
  DESC_FREE: "manage_subscription_plan_section_desc_free",
  DESC_FREE_TRIAL: "manage_subscription_plan_section_trial_desc_markup",
  DESC_STANDARD: "manage_subscription_plan_section_desc_standard",
  DESC_TEAM: "manage_subscription_plan_section_desc_team",
  FEATS_COMPARE: "manage_subscription_plan_section_compare_link",
  FEATS_ADVANCED: "manage_subscription_plan_section_features_link_advanced",
  FEATS_ESSENTIALS: "manage_subscription_plan_section_features_link_essentials",
  FEATS_FAMILY: "manage_subscription_plan_section_features_link_family",
  FEATS_PREMIUM: "manage_subscription_plan_section_features_link_premium",
  CANCEL: "manage_subscription_plan_section_cancel",
  NEED_A_CHANGE: "manage_subscription_plan_section_cancel_change",
  FOOTER_APPLE: "manage_subscription_plan_section_apple_cancel_text_markup",
  FOOTER_GOOGLE: "manage_subscription_plan_section_google_cancel_text_markup",
  PAYPAL_TOOLTIP: "manage_subscription_plan_section_paypal_tooltip",
  REJOIN: "manage_subscription_plan_section_rejoin_button",
  UPGRADE: "manage_subscription_plan_section_upgrade_button",
  VIEW_PLANS: "manage_subscription_plan_section_buy_plans_button",
};
const getPurchaseUrl = (
  isAdvanced: boolean,
  isEssentials: boolean,
  isFamily: boolean,
  routes: NamedRoutes,
  autoRenewInfo?: AutoRenewInfo,
  subscriptionCode?: string
) => {
  if (isAdvanced) {
    return routes.userGoAdvanced(
      subscriptionCode,
      getPlanRenewalPeriodicity(autoRenewInfo)
    );
  }
  if (isEssentials) {
    return routes.userGoEssentials(
      subscriptionCode,
      getPlanRenewalPeriodicity(autoRenewInfo)
    );
  }
  if (isFamily) {
    return routes.userGoFamily(
      subscriptionCode,
      getPlanRenewalPeriodicity(autoRenewInfo)
    );
  }
  return routes.userGoPremium(
    subscriptionCode,
    getPlanRenewalPeriodicity(autoRenewInfo)
  );
};
export interface PlanCardProps {
  setCancellationStep: (step: CancellationStep) => void;
}
const LoadingStatus = () => (
  <Card
    sx={{
      marginBottom: "16px",
      padding: "32px",
      display: "flex",
      justifyContent: "center",
    }}
  >
    <IndeterminateLoader />
  </Card>
);
export const PlanCard = () => {
  const subscriptionCode = useSubscriptionCode();
  const premiumStatus = usePremiumStatus();
  const { routes } = useRouterGlobalSettingsContext();
  const { translate } = useTranslate();
  if (premiumStatus.status !== DataStatus.Success || !premiumStatus.data) {
    return <LoadingStatus />;
  }
  const {
    autoRenewInfo,
    autoRenewal,
    endDate = 0,
    planType,
  } = premiumStatus.data;
  const {
    isPaidAccountUser,
    isBusinessUser,
    isEssentialUser,
    isFamilyUser,
    isFamilyInvitee,
    isPremiumUser,
    isPremiumPlusUser,
    isFreeTrialUser,
    isAdvancedUser,
  } = getPlanTypes(premiumStatus.data);
  const isAppStoreUser = planType?.includes("ios");
  const isGooglePlayUser = planType?.includes("playstore");
  let planTitleText = "";
  let secondaryLink = "";
  let descriptionText;
  const renewalDateString = formatRenewalDate(endDate, translate.shortDate);
  if (isFamilyInvitee) {
    descriptionText = translate(I18N_KEYS.DESC_FAMILY_INVITEE);
  } else {
    const descriptionString = autoRenewal
      ? I18N_KEYS.DESC_B2C
      : I18N_KEYS.DESC_CANCELLED;
    descriptionText = endDate
      ? translate.markup(descriptionString, {
          date: renewalDateString,
          days: "30",
        })
      : "";
  }
  if (isBusinessUser) {
    const activeSpace = getActiveSpace(premiumStatus.data);
    if (
      activeSpace &&
      getPlanNameFromTier(activeSpace.tier) === SpaceTiers.Team
    ) {
      planTitleText = translate(I8N_KEYS_PLAN_NAMES.TEAM);
      descriptionText = translate(I18N_KEYS.DESC_TEAM);
    } else if (
      activeSpace &&
      getPlanNameFromTier(activeSpace.tier) === SpaceTiers.Standard
    ) {
      planTitleText = translate(I8N_KEYS_PLAN_NAMES.STANDARD);
      descriptionText = translate(I18N_KEYS.DESC_STANDARD);
    } else if (
      activeSpace &&
      getPlanNameFromTier(activeSpace.tier) === SpaceTiers.BusinessPlus
    ) {
      planTitleText = translate(I8N_KEYS_PLAN_NAMES.BUSINESS_PLUS);
      descriptionText = translate(I18N_KEYS.DESC_BUSINESS_PLUS);
    } else {
      planTitleText = translate(I8N_KEYS_PLAN_NAMES.BUSINESS);
      descriptionText = translate(I18N_KEYS.DESC_BUSINESS);
    }
  } else if (isFamilyUser) {
    planTitleText = translate(I8N_KEYS_PLAN_NAMES.FAMILY);
    secondaryLink = translate(I18N_KEYS.FEATS_FAMILY);
  } else if (isAdvancedUser) {
    planTitleText = translate(I8N_KEYS_PLAN_NAMES.ADVANCED);
    secondaryLink = translate(I18N_KEYS.FEATS_ADVANCED);
  } else if (isEssentialUser) {
    planTitleText = translate(I8N_KEYS_PLAN_NAMES.ESSENTIALS);
    secondaryLink = translate(I18N_KEYS.FEATS_ESSENTIALS);
  } else if (isFreeTrialUser) {
    const daysUntilTrialExpires = differenceInDays(
      new Date(endDate * 1000),
      new Date().getTime()
    );
    planTitleText = translate(I8N_KEYS_PLAN_NAMES.PREMIUM_TRIAL);
    descriptionText = translate.markup(I18N_KEYS.DESC_FREE_TRIAL, {
      days: daysUntilTrialExpires,
      date: renewalDateString,
    });
    secondaryLink = translate(I18N_KEYS.FEATS_COMPARE);
  } else if (isPremiumPlusUser) {
    planTitleText = translate(I8N_KEYS_PLAN_NAMES.PREMIUM_PLUS);
  } else if (isPremiumUser) {
    planTitleText = translate(I8N_KEYS_PLAN_NAMES.PREMIUM);
    secondaryLink = translate(I18N_KEYS.FEATS_PREMIUM);
  } else {
    planTitleText = translate(I8N_KEYS_PLAN_NAMES.FREE);
    descriptionText = translate(I18N_KEYS.DESC_FREE);
    secondaryLink = translate(I18N_KEYS.FEATS_COMPARE);
  }
  const isPlansCTAPrimary =
    !isPaidAccountUser || isFreeTrialUser || !autoRenewal;
  const appleFooter = translate.markup(I18N_KEYS.FOOTER_APPLE, {
    link: APP_STORE_PLANS,
  });
  const googleFooter = translate.markup(I18N_KEYS.FOOTER_GOOGLE, {
    link: GOOGLE_PLAY_PLANS,
  });
  const goToPurchasePage = () => {
    const purchaseUrl = getPurchaseUrl(
      isAdvancedUser,
      isEssentialUser,
      isFamilyUser,
      routes,
      autoRenewInfo,
      subscriptionCode ?? ""
    );
    openDashlaneUrl(purchaseUrl, {
      type: "subscriptionManagement",
      action: "goToCheckout",
    });
    logPlanRestartEvent(premiumStatus.data);
  };
  return (
    <Card
      gap="8px"
      sx={{ marginBottom: "16px", padding: "32px", maxWidth: "70vw" }}
    >
      <Flex alignItems="center" justifyContent="space-between">
        <div>
          <Paragraph
            color="ds.text.neutral.quiet"
            textStyle="ds.title.supporting.small"
            sx={{ marginBottom: "10px" }}
          >
            {translate(I18N_KEYS.CARD_TITLE)}
          </Paragraph>
          <Heading as="h2" sx={{ marginBottom: "10px" }}>
            {planTitleText}
          </Heading>
        </div>

        <div>
          {!isPaidAccountUser && !isFreeTrialUser ? (
            <Button
              mood={isPlansCTAPrimary ? "brand" : "neutral"}
              onClick={goToPurchasePage}
              type="button"
              role="link"
            >
              {translate(I18N_KEYS.UPGRADE)}
            </Button>
          ) : null}
          {isFreeTrialUser ? (
            <Button
              onClick={goToPurchasePage}
              mood="brand"
              sx={{ marginLeft: "8px" }}
              type="button"
              role="link"
            >
              {translate(I18N_KEYS.BUY_AS_TRIAL)}
            </Button>
          ) : null}
        </div>
      </Flex>

      <Paragraph color="ds.text.neutral.quiet">{descriptionText}</Paragraph>
      {secondaryLink ? (
        <LinkButton
          href={routes.userGoPlans}
          isExternal
          onClick={() => {
            logPlansPageEvent(CallToAction.PlanDetails);
          }}
          target="_blank"
          rel="noopener noreferrer"
        >
          {secondaryLink}
        </LinkButton>
      ) : null}

      {isAppStoreUser || isGooglePlayUser ? (
        <div
          sx={{
            marginTop: "32px",
          }}
        >
          <Paragraph
            color="ds.text.neutral.quiet"
            sx={{
              borderTop: "1px solid ds.border.neutral.standard",
              marginTop: "32px",
              paddingTop: "32px",
            }}
          >
            {isAppStoreUser ? appleFooter : googleFooter}
          </Paragraph>
        </div>
      ) : null}
    </Card>
  );
};
