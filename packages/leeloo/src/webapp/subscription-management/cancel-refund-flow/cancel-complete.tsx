import { useEffect, useState } from "react";
import { DataStatus } from "@dashlane/carbon-api-consumers";
import { PremiumStatus } from "@dashlane/communication";
import { CancelPlanStep, PageView } from "@dashlane/hermes";
import {
  Button,
  Card,
  Heading,
  IndeterminateLoader,
  Infobox,
  LinkButton,
  Paragraph,
} from "@dashlane/design-system";
import { isSuccess } from "@dashlane/framework-types";
import {
  useFeatureFlip,
  useModuleCommands,
  useModuleQuery,
} from "@dashlane/framework-react";
import { b2cPlansApi, PLANS_FF } from "@dashlane/plans-contracts";
import {
  isAccountFamily,
  isAdvancedPlan,
  isEssentialsPlan,
} from "../../../libs/account/helpers";
import { getPlanRenewalPeriodicity } from "../../../libs/premium-status.lib";
import { logPageView } from "../../../libs/logs/logEvent";
import { openDashlaneUrl } from "../../../libs/external-urls";
import { useSubscriptionCode } from "../../../libs/hooks/use-subscription-code";
import { usePremiumStatus } from "../../../libs/carbon/hooks/usePremiumStatus";
import { useRouterGlobalSettingsContext } from "../../../libs/router/RouterGlobalSettingsProvider";
import useTranslate from "../../../libs/i18n/useTranslate";
import { NamedRoutes } from "../../../app/routes/types";
import { TERMS_OF_SERVICE } from "../../../team/urls";
import { logCancellationEvent, logPlanRestartEvent } from "../logs";
import { CancellationStep, SurveyAnswer } from "../types";
import {
  formatRenewalDate,
  getTranslatedPlanName,
} from "../plan-information/helpers";
import { RefundLossAversionDialog } from "./refund-loss-aversion-dialog";
const I18N_KEYS = {
  INFOBOX_TITLE: "manage_subscription_cancel_confirmation_infobox_title",
  INFOBOX_DESCRIPTION:
    "manage_subscription_cancel_confirmation_infobox_description",
  CARD_TITLE_NEW: "manage_subscription_cancel_confirmation_card_title",
  CARD_DESCRIPTION: "manage_subscription_cancel_confirmation_card_description",
  VIEW_PLANS_LINK: "manage_subscription_cancel_confirmation_view_plans_link",
  RESTART_PLAN_BUTTON:
    "manage_subscription_cancel_confirmation_restart_plan_button",
  REFUND_CARD_TITLE:
    "manage_subscription_cancel_confirmation_refund_card_title",
  REFUND_CARD_DESCRIPTION:
    "manage_subscription_cancel_confirmation_refund_card_description",
  REFUND_CARD_LINK: "manage_subscription_cancel_confirmation_refund_card_link",
  REFUND_CARD_BUTTON:
    "manage_subscription_cancel_confirmation_refund_card_button",
};
const getRestartPlanUrl = (
  premiumStatusData: PremiumStatus,
  routes: NamedRoutes,
  subscriptionCode?: string
) => {
  const { autoRenewInfo } = premiumStatusData;
  const userPeriodicity = getPlanRenewalPeriodicity(autoRenewInfo);
  if (isAdvancedPlan(premiumStatusData)) {
    return routes.userGoAdvanced(subscriptionCode, userPeriodicity);
  }
  if (isEssentialsPlan(premiumStatusData)) {
    return routes.userGoEssentials(subscriptionCode, userPeriodicity);
  }
  if (isAccountFamily(premiumStatusData)) {
    return routes.userGoFamily(subscriptionCode, userPeriodicity);
  }
  return routes.userGoPremium(subscriptionCode, userPeriodicity);
};
export interface CancelCompleteCardProps {
  setCancellationStep: (step: CancellationStep) => void;
  surveyAnswer?: SurveyAnswer;
}
export const CancelCompleteCard = ({
  setCancellationStep,
  surveyAnswer,
}: CancelCompleteCardProps) => {
  const subscriptionCode = useSubscriptionCode();
  const premiumStatus = usePremiumStatus();
  const { routes } = useRouterGlobalSettingsContext();
  const { translate } = useTranslate();
  const [showLossAversionDialog, setShowLossAversionDialog] = useState(false);
  const hasLossAversionFF = !!useFeatureFlip(
    PLANS_FF.CANCEL_DISCOUNT_PHASE2_FF
  );
  const isEligibleForRefundQuery = useModuleQuery(
    b2cPlansApi,
    "getRefundEligibility"
  );
  const { requestRefund } = useModuleCommands(b2cPlansApi);
  useEffect(() => {
    if (premiumStatus.status === DataStatus.Success && premiumStatus.data) {
      logPageView(PageView.PlansManagementCancelDone);
      logCancellationEvent(
        CancelPlanStep.SuccessCancel,
        premiumStatus.data,
        surveyAnswer
      );
    }
  }, [premiumStatus, surveyAnswer]);
  if (
    premiumStatus.status !== DataStatus.Success ||
    !premiumStatus.data ||
    isEligibleForRefundQuery.status === DataStatus.Loading
  ) {
    return <IndeterminateLoader />;
  }
  const isEligibleForRefund = !!isEligibleForRefundQuery.data?.isEligible;
  const planName = getTranslatedPlanName(premiumStatus.data, translate);
  const renewalDate = formatRenewalDate(
    premiumStatus.data.endDate ?? 0,
    translate.shortDate
  );
  const restartPlanUrl = getRestartPlanUrl(
    premiumStatus.data,
    routes,
    subscriptionCode ?? ""
  );
  const goToPlansPage = () => {
    openDashlaneUrl(routes.userGoPlans, {
      type: "subscriptionManagement",
      action: "goToPlans",
    });
  };
  const onClickRequestRefund = async () => {
    setCancellationStep(CancellationStep.REFUND_PENDING);
    const result = await requestRefund();
    setCancellationStep(
      isSuccess(result)
        ? CancellationStep.REFUND_COMPLETE
        : CancellationStep.REFUND_FAILURE
    );
  };
  const restartSubscription = () => {
    openDashlaneUrl(restartPlanUrl, {
      type: "subscriptionManagement",
      action: "restartPlan",
    });
    logPlanRestartEvent(premiumStatus.data);
  };
  return (
    <div
      sx={{
        display: "flex",
        flexDirection: "row",
        gap: "16px",
        maxWidth: "1072px",
      }}
    >
      <div
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          maxWidth: "709px",
        }}
      >
        <Infobox
          mood="positive"
          title={translate(I18N_KEYS.INFOBOX_TITLE)}
          description={translate(I18N_KEYS.INFOBOX_DESCRIPTION, {
            planNameString: planName,
            endDate: renewalDate,
          })}
        />
        <Card gap="10px">
          <Heading textStyle="ds.title.section.medium" as="h1">
            {translate(I18N_KEYS.CARD_TITLE_NEW)}
          </Heading>
          <Paragraph color="ds.text.neutral.quiet">
            {translate(I18N_KEYS.CARD_DESCRIPTION)}
          </Paragraph>
          <div sx={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
            <Button
              layout="iconTrailing"
              icon="ActionOpenExternalLinkOutlined"
              intensity="supershy"
              onClick={goToPlansPage}
              size="small"
            >
              {translate(I18N_KEYS.VIEW_PLANS_LINK)}
            </Button>
            <Button size="small" onClick={restartSubscription}>
              {translate(I18N_KEYS.RESTART_PLAN_BUTTON, {
                planNameString: planName,
              })}
            </Button>
          </div>
        </Card>
      </div>

      {isEligibleForRefund ? (
        <Card
          sx={{
            alignSelf: "start",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            maxWidth: "347px",
          }}
        >
          <Heading
            as="h5"
            color="ds.text.neutral.catchy"
            textStyle="ds.title.block.medium"
          >
            {translate(I18N_KEYS.REFUND_CARD_TITLE)}
          </Heading>
          <Paragraph>
            {translate(I18N_KEYS.REFUND_CARD_DESCRIPTION, {
              planNameString: planName,
            })}
          </Paragraph>
          <LinkButton isExternal href={TERMS_OF_SERVICE}>
            {translate(I18N_KEYS.REFUND_CARD_LINK)}
          </LinkButton>
          <Button
            mood="neutral"
            intensity="quiet"
            onClick={() =>
              hasLossAversionFF
                ? setShowLossAversionDialog(true)
                : onClickRequestRefund()
            }
          >
            {translate(I18N_KEYS.REFUND_CARD_BUTTON)}
          </Button>
        </Card>
      ) : null}

      {hasLossAversionFF ? (
        <RefundLossAversionDialog
          isOpen={showLossAversionDialog}
          setIsOpen={setShowLossAversionDialog}
          refundHandler={onClickRequestRefund}
          premiumStatusData={premiumStatus.data}
        />
      ) : null}
    </div>
  );
};
