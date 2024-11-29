import { Button, Card, LinkButton, Paragraph } from "@dashlane/design-system";
import { CallToAction, CancelPlanStep } from "@dashlane/hermes";
import { DataStatus } from "@dashlane/carbon-api-consumers";
import { useFeatureFlip } from "@dashlane/framework-react";
import { PLANS_FF } from "@dashlane/plans-contracts";
import {
  GET_PLANS_URL,
  GET_PREMIUM_FAMILY_URL,
  GET_PREMIUM_URL,
} from "../../../app/routes/constants";
import { openUrl } from "../../../libs/external-urls";
import useTranslate from "../../../libs/i18n/useTranslate";
import { usePremiumStatus } from "../../../libs/carbon/hooks/usePremiumStatus";
import { useSubscriptionCode } from "../../../libs/hooks/use-subscription-code";
import { CancellationStep } from "../types";
import {
  logCancellationEvent,
  logPlanRestartEvent,
  logPlansPageEvent,
} from "../logs";
import {
  getPlanTypes,
  isAppStoreUser,
  isGooglePlayUser,
} from "../plan-information/helpers";
export interface PlanCardProps {
  setCancellationStep: (step: CancellationStep) => void;
}
const I18N_KEYS = {
  NEED_A_CHANGE: "manage_subscription_plan_section_cancel_change",
  CANCEL_SUBSCRIPTION: "manage_subscription_plan_section_cancel",
  CHANGED_YOUR_MIND: "manage_subscription_plan_changed_your_mind",
  CHANGE_YOUR_MIND_DESCRIPTION:
    "manage_subscription_plan_changed_your_mind_description",
  CHANGE_YOUR_MIND_DESCRIPTION_LEGACY:
    "manage_subscription_plan_changed_your_mind_description_legacy",
  VIEW_ALL_PLANS: "manage_subscription_plan_change_viw_all_plans",
  RESTART_BUTTON: "manage_subscription_plan_change_viw_restart_button",
  RESTART_BUTTON_LEGACY:
    "manage_subscription_plan_change_viw_restart_button_legacy",
};
export const SubscriptionSideContent = ({
  setCancellationStep,
}: PlanCardProps) => {
  const { translate } = useTranslate();
  const premiumStatus = usePremiumStatus();
  const subscriptionCode = useSubscriptionCode();
  const hasLossAversionFF = !!useFeatureFlip(
    PLANS_FF.CANCEL_DISCOUNT_PHASE2_FF
  );
  if (premiumStatus.status !== DataStatus.Success) {
    return null;
  }
  const isAppleUser = isAppStoreUser(premiumStatus.data.planType ?? "");
  const isAndroidUser = isGooglePlayUser(premiumStatus.data.planType ?? "");
  const {
    isBusinessUser,
    isFamilyInvitee,
    isFreeTrialUser,
    isPaidAccountUser,
    isPremiumPlusUser,
    isFamilyUser,
    isPremiumUser,
  } = getPlanTypes(premiumStatus.data);
  const isAutoRenewalEnabled = premiumStatus.data.autoRenewal;
  if (
    isBusinessUser ||
    isFamilyInvitee ||
    isFreeTrialUser ||
    isAppleUser ||
    isAndroidUser ||
    !isPaidAccountUser
  ) {
    return null;
  }
  const showRestartCard = isPaidAccountUser && !isAutoRenewalEnabled;
  const isLegacyPlan = !isPremiumUser && !isFamilyUser;
  const startCancelFlow = () => {
    setCancellationStep(
      hasLossAversionFF
        ? CancellationStep.LOSS_AVERSION
        : CancellationStep.CANCEL_CONFIRM
    );
    logCancellationEvent(CancelPlanStep.Start, premiumStatus.data);
  };
  const handleViewAllPlans = () => {
    logPlansPageEvent(CallToAction.AllOffers);
    openUrl(GET_PLANS_URL);
  };
  const handleRestartButton = () => {
    if (isPremiumPlusUser || isFamilyUser) {
      openUrl(`${GET_PREMIUM_FAMILY_URL}?subCode=${subscriptionCode ?? ""}`);
    } else {
      openUrl(`${GET_PREMIUM_URL}?subCode=${subscriptionCode ?? ""}`);
    }
    logPlanRestartEvent(premiumStatus.data);
  };
  return (
    <Card sx={{ padding: "32px", maxWidth: "20vw", height: "fit-content" }}>
      {showRestartCard ? (
        <div sx={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <Paragraph
            textStyle="ds.title.block.medium"
            color="ds.text.neutral.catchy"
          >
            {translate(I18N_KEYS.CHANGED_YOUR_MIND)}
          </Paragraph>
          <Paragraph>
            {isLegacyPlan
              ? translate(I18N_KEYS.CHANGE_YOUR_MIND_DESCRIPTION_LEGACY)
              : translate(I18N_KEYS.CHANGE_YOUR_MIND_DESCRIPTION, {
                  planName: isFamilyUser ? "Family" : "Premium",
                })}
          </Paragraph>

          <LinkButton onClick={handleViewAllPlans} isExternal>
            {translate(I18N_KEYS.VIEW_ALL_PLANS)}
          </LinkButton>

          <Button onClick={handleRestartButton}>
            {isLegacyPlan
              ? translate(I18N_KEYS.RESTART_BUTTON_LEGACY)
              : translate(I18N_KEYS.RESTART_BUTTON, {
                  planName: isFamilyUser ? "Family" : "Premium",
                })}
          </Button>
        </div>
      ) : (
        <div sx={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <Paragraph
            textStyle="ds.title.block.medium"
            color="ds.text.neutral.catchy"
          >
            {translate(I18N_KEYS.NEED_A_CHANGE)}
          </Paragraph>
          <LinkButton
            onClick={startCancelFlow}
            data-testid="buttonCancelSubscriptionConfirmation"
          >
            {translate(I18N_KEYS.CANCEL_SUBSCRIPTION)}
          </LinkButton>
        </div>
      )}
    </Card>
  );
};
