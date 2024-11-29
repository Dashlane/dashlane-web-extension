import { useEffect, useState } from "react";
import { DataStatus } from "@dashlane/carbon-api-consumers";
import {
  Button,
  Card,
  Heading,
  IndeterminateLoader,
  Infobox,
  Paragraph,
} from "@dashlane/design-system";
import { useFeatureFlip, useModuleQuery } from "@dashlane/framework-react";
import { CancelPlanStep, PageView } from "@dashlane/hermes";
import { b2cPlansApi, PLANS_FF } from "@dashlane/plans-contracts";
import { Radio, RadioGroup } from "@dashlane/ui-components";
import {
  GET_PREMIUM_FAMILY_URL,
  GET_PREMIUM_URL,
} from "../../../app/routes/constants";
import {
  isAccountFamily,
  isPremiumPlusPlan,
} from "../../../libs/account/helpers";
import { logPageView } from "../../../libs/logs/logEvent";
import { usePremiumStatus } from "../../../libs/carbon/hooks/usePremiumStatus";
import useTranslate from "../../../libs/i18n/useTranslate";
import { useSubscriptionCode } from "../../../libs/hooks/use-subscription-code";
import { carbonConnector } from "../../../libs/carbon/connector";
import { openUrl } from "../../../libs/external-urls";
import { logCancellationEvent } from "../logs";
import {
  formatRenewalDate,
  getTranslatedPlanName,
} from "../plan-information/helpers";
import { CancellationStep, SurveyAnswer } from "../types";
import {
  DASHLANE_HELP_CENTER,
  DASHLANE_PRICING_PAGE_PERSONAL,
  DASHLANE_REQUEST_PRODUCT_IDEA,
} from "../../urls";
import { CancelationDiscountDialog } from "./cancelation-discount-dialog";
const I18N_KEYS = {
  INFOBOX_TITLE: "manage_subscription_cancel_section_with_survey_card_title",
  INFOBOX_DESCRIPTION: "manage_subscription_cancel_section_infobox_description",
  SURVEY_TITLE: "manage_subscription_cancel_section_survey_title",
  SURVEY_DESCRIPTION: "manage_subscription_cancel_section_survey_description",
  SURVEY_ANSWER_AUTOFILL:
    "manage_subscription_cancel_section_with_survey_radio_label_didnt_work",
  SURVEY_ANSWER_TECH_ISSUES:
    "manage_subscription_cancel_section_with_survey_radio_label_tech_issues",
  SURVEY_ANSWER_TOO_EXPENSIVE:
    "manage_subscription_cancel_section_with_survey_radio_label_too_expensive",
  SURVEY_ANSWER_DOESNT_HAVE_FEATURES_NEEDED:
    "manage_subscription_cancel_section_with_survey_radio_label_doesnt_have_features_needed",
  SURVEY_ANSWER_OTHER_REASON:
    "manage_subscription_cancel_section_survey_other_reason",
  BUTTON_KEEP_PREMIUM: "manage_subscription_cancel_section_button_keep_premium",
  BUTTON_CANCEL_SUBSCRIPTION:
    "manage_subscription_cancel_section_button_cancel",
};
const ANSWERS_INFOBOX_KEYS = {
  AUTOFILL_TITLE:
    "manage_subscription_cancel_section_survey_infobox_autofill_title",
  AUTOFILL_DESCRIPTION:
    "manage_subscription_cancel_section_survey_infobox_autofill_description_markup",
  ISSUES_TITLE:
    "manage_subscription_cancel_section_survey_infobox_issues_title",
  ISSUES_DESCRIPTION:
    "manage_subscription_cancel_section_survey_infobox_issues_description_markup",
  EXPENSIVE_TITLE:
    "manage_subscription_cancel_section_survey_infobox_expensive_title",
  EXPENSIVE_DESCRIPTION:
    "manage_subscription_cancel_section_survey_infobox_expensive_description_markup",
  FEATURES_TITLE:
    "manage_subscription_cancel_section_survey_infobox_features_title",
  FEATURES_DESCRIPTION:
    "manage_subscription_cancel_section_survey_infobox_features_description_markup",
};
export interface CancelSubscriptionSurveyProps {
  setCancellationStep: (step: CancellationStep) => void;
  setSurveyAnswer: (values: SurveyAnswer) => void;
  surveyAnswer?: SurveyAnswer;
}
export const CancelSubscriptionSurvey = ({
  setCancellationStep,
  setSurveyAnswer,
  surveyAnswer,
}: CancelSubscriptionSurveyProps) => {
  const { translate } = useTranslate();
  const premiumStatusData = usePremiumStatus();
  const subscriptionCode = useSubscriptionCode();
  const hasDiscountFF = useFeatureFlip(PLANS_FF.CANCEL_DISCOUNT_FF);
  const discountCoupon = useModuleQuery(
    b2cPlansApi,
    "getCancelationCouponDiscount"
  );
  const [showDiscountDialog, setShowDiscountDialog] = useState(false);
  useEffect(() => {
    logPageView(PageView.PlansManagementAskCancel);
  }, []);
  if (
    premiumStatusData.status !== DataStatus.Success ||
    !premiumStatusData.data ||
    discountCoupon.status !== DataStatus.Success
  ) {
    return <IndeterminateLoader />;
  }
  const planName = getTranslatedPlanName(premiumStatusData.data, translate);
  const planEndDate = formatRenewalDate(
    premiumStatusData.data.endDate ?? 0,
    translate.shortDate
  );
  const handleOnChange = (event: {
    currentTarget: {
      value: SurveyAnswer;
    };
  }) => {
    setSurveyAnswer(event.currentTarget.value);
  };
  const handleKeepPremium = () => {
    logCancellationEvent(
      CancelPlanStep.Abandon,
      premiumStatusData.data,
      surveyAnswer
    );
    setCancellationStep(CancellationStep.SUBSCRIPTION);
  };
  const cancelSubscription = async () => {
    setCancellationStep(CancellationStep.CANCEL_PENDING);
    const result = await carbonConnector.cancelAutoRenew();
    setCancellationStep(
      result.success
        ? CancellationStep.CANCEL_COMPLETE
        : CancellationStep.CANCEL_FAILURE
    );
  };
  const handleSubmitCancelSubscription = async () => {
    if (
      hasDiscountFF &&
      discountCoupon.data.couponCode &&
      surveyAnswer === SurveyAnswer.TOO_EXPENSIVE
    ) {
      setShowDiscountDialog(true);
      return;
    }
    await cancelSubscription();
  };
  const handleUseDiscount = () => {
    if (
      isPremiumPlusPlan(premiumStatusData.data) ||
      isAccountFamily(premiumStatusData.data)
    ) {
      setCancellationStep(CancellationStep.SUBSCRIPTION);
      openUrl(
        `${GET_PREMIUM_FAMILY_URL}?subCode=${subscriptionCode ?? ""}&coupon=${
          discountCoupon.data.couponCode
        }`
      );
    } else {
      setCancellationStep(CancellationStep.SUBSCRIPTION);
      openUrl(
        `${GET_PREMIUM_URL}?subCode=${subscriptionCode ?? ""}&coupon=${
          discountCoupon.data.couponCode
        }`
      );
    }
  };
  const getInfoBoxProps = (answer: SurveyAnswer) => {
    switch (answer) {
      case SurveyAnswer.AUTOFILL_DOESNT_WORK:
        return {
          title: translate(ANSWERS_INFOBOX_KEYS.AUTOFILL_TITLE),
          description: translate.markup(
            ANSWERS_INFOBOX_KEYS.AUTOFILL_DESCRIPTION,
            {
              link: DASHLANE_HELP_CENTER,
            },
            {
              linkTarget: "_blank",
            }
          ),
        };
      case SurveyAnswer.TECHNICAL_ISSUES:
        return {
          title: translate(ANSWERS_INFOBOX_KEYS.ISSUES_TITLE),
          description: translate.markup(
            ANSWERS_INFOBOX_KEYS.ISSUES_DESCRIPTION,
            {
              link: DASHLANE_HELP_CENTER,
            },
            {
              linkTarget: "_blank",
            }
          ),
        };
      case SurveyAnswer.TOO_EXPENSIVE:
        return {
          title: translate(ANSWERS_INFOBOX_KEYS.EXPENSIVE_TITLE),
          description: translate.markup(
            ANSWERS_INFOBOX_KEYS.EXPENSIVE_DESCRIPTION,
            { link: DASHLANE_PRICING_PAGE_PERSONAL },
            { linkTarget: "_blank" }
          ),
        };
      case SurveyAnswer.MISSING_FEATURES:
        return {
          title: translate(ANSWERS_INFOBOX_KEYS.FEATURES_TITLE),
          description: translate.markup(
            ANSWERS_INFOBOX_KEYS.FEATURES_DESCRIPTION,
            { link: DASHLANE_REQUEST_PRODUCT_IDEA },
            { linkTarget: "_blank" }
          ),
        };
      default:
        return {
          title: "",
          description: "",
        };
    }
  };
  const SurveyInfoBox = ({ answer }: { answer?: SurveyAnswer }) => {
    if (!answer || answer === SurveyAnswer.OTHER) {
      return null;
    }
    const { title, description } = getInfoBoxProps(answer);
    return <Infobox title={title} description={description} mood="brand" />;
  };
  return (
    <Card sx={{ maxWidth: "55vw" }}>
      <Heading
        as="h1"
        color="ds.text.neutral.catchy"
        textStyle="ds.title.section.medium"
      >
        {translate(I18N_KEYS.INFOBOX_TITLE)}
      </Heading>
      <Paragraph>
        {translate(I18N_KEYS.INFOBOX_DESCRIPTION, {
          planName,
          endDate: planEndDate,
        })}
      </Paragraph>
      <Card
        sx={{
          backgroundColor: "ds.container.agnostic.neutral.quiet",
        }}
      >
        <Heading
          as="h2"
          color="ds.text.neutral.catchy"
          textStyle="ds.title.block.medium"
        >
          {translate(I18N_KEYS.SURVEY_TITLE)}
        </Heading>
        <Paragraph
          color="ds.text.neutral.quiet"
          textStyle="ds.body.reduced.regular"
        >
          {translate(I18N_KEYS.SURVEY_DESCRIPTION)}
        </Paragraph>
        <RadioGroup
          value={surveyAnswer}
          onChange={handleOnChange}
          sx={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Radio
            label={translate(I18N_KEYS.SURVEY_ANSWER_AUTOFILL)}
            value={SurveyAnswer.AUTOFILL_DOESNT_WORK}
          />
          <Radio
            label={translate(I18N_KEYS.SURVEY_ANSWER_TECH_ISSUES)}
            value={SurveyAnswer.TECHNICAL_ISSUES}
          />
          <Radio
            label={translate(I18N_KEYS.SURVEY_ANSWER_TOO_EXPENSIVE)}
            value={SurveyAnswer.TOO_EXPENSIVE}
          />

          <Radio
            label={translate(
              I18N_KEYS.SURVEY_ANSWER_DOESNT_HAVE_FEATURES_NEEDED
            )}
            value={SurveyAnswer.MISSING_FEATURES}
          />
          <Radio
            label={translate(I18N_KEYS.SURVEY_ANSWER_OTHER_REASON)}
            value={SurveyAnswer.OTHER}
          />
        </RadioGroup>
        <SurveyInfoBox answer={surveyAnswer} />
      </Card>
      <div sx={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
        <Button mood="neutral" intensity="quiet" onClick={handleKeepPremium}>
          {translate(I18N_KEYS.BUTTON_KEEP_PREMIUM)}
        </Button>
        <Button
          mood="danger"
          intensity="catchy"
          disabled={!surveyAnswer}
          onClick={handleSubmitCancelSubscription}
        >
          {translate(I18N_KEYS.BUTTON_CANCEL_SUBSCRIPTION)}
        </Button>
      </div>
      {showDiscountDialog ? (
        <CancelationDiscountDialog
          onClose={() => setShowDiscountDialog(false)}
          onConfirmCancelation={cancelSubscription}
          onUseDiscount={handleUseDiscount}
        />
      ) : null}
    </Card>
  );
};
