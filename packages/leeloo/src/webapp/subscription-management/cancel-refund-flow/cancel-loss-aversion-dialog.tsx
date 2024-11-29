import { Dispatch, SetStateAction } from "react";
import {
  Button,
  CallToAction,
  ClickOrigin,
  UserCallToActionEvent,
  UserClickEvent,
} from "@dashlane/hermes";
import { Dialog, LinkButton, Paragraph } from "@dashlane/design-system";
import { DataStatus } from "@dashlane/carbon-api-consumers";
import useTranslate from "../../../libs/i18n/useTranslate";
import { usePremiumStatus } from "../../../libs/carbon/hooks/usePremiumStatus";
import { logEvent } from "../../../libs/logs/logEvent";
import {
  DASHLANE_HELP_CENTER,
  DASHLANE_PRICING_PAGE_PERSONAL,
} from "../../urls";
import {
  formatRenewalDate,
  getTranslatedPlanName,
} from "../plan-information/helpers";
import { CancellationStep } from "../types";
import { LostFeaturesList } from "./lost-features-list";
interface Props {
  isOpen: boolean;
  setStep: Dispatch<SetStateAction<CancellationStep>>;
}
const I18N_KEYS = {
  CLOSE_ACTION_LABEL_A11Y:
    "manage_subscription_plan_loss_aversion_dialog_close_label_a11y",
  ALT_OPTIONS: "manage_subscription_plan_loss_aversion_dialog_alternative",
  COMPARE_PLANS_LINK:
    "manage_subscription_plan_loss_aversion_dialog_compare_plans_link",
  CONTINUE_CANCEL:
    "manage_subscription_plan_loss_aversion_dialog_continue_to_cancel_page_cta",
  HEADER_TITLE:
    "manage_subscription_plan_loss_aversion_dialog_cancel_header_title",
  HEADER_PARAGRAPH:
    "manage_subscription_plan_loss_aversion_dialog_cancel_header_paragraph_markup",
  HELP_CENTER_LINK:
    "manage_subscription_plan_loss_aversion_dialog_help_center_link",
  KEEP_PLAN: "manage_subscription_plan_loss_aversion_dialog_keep_plan_cta",
  LOSSLIST_TITLE:
    "manage_subscription_plan_loss_aversion_dialog_cancel_losslist_title",
};
export const CancelLossAversionDialog = ({ isOpen, setStep }: Props) => {
  const { translate } = useTranslate();
  const premiumStatus = usePremiumStatus();
  if (premiumStatus?.status !== DataStatus.Success || !premiumStatus.data) {
    return null;
  }
  const planName = getTranslatedPlanName(premiumStatus.data, translate);
  const { endDate = 0 } = premiumStatus.data;
  const planEndDate = formatRenewalDate(endDate, translate.shortDate);
  const handleClose = () => setStep(CancellationStep.SUBSCRIPTION);
  const handleClickToClose = () => {
    logEvent(
      new UserCallToActionEvent({
        callToActionList: [
          CallToAction.ContinueCancellation,
          CallToAction.KeepPremium,
        ],
        hasChosenNoAction: true,
      })
    );
    handleClose();
  };
  const onClickKeepPremium = () => {
    logEvent(
      new UserCallToActionEvent({
        chosenAction: CallToAction.KeepPremium,
        callToActionList: [
          CallToAction.ContinueCancellation,
          CallToAction.KeepPremium,
        ],
        hasChosenNoAction: false,
      })
    );
    handleClose();
  };
  const onClickContinueCancelation = () => {
    logEvent(
      new UserCallToActionEvent({
        chosenAction: CallToAction.ContinueCancellation,
        callToActionList: [
          CallToAction.ContinueCancellation,
          CallToAction.KeepPremium,
        ],
        hasChosenNoAction: false,
      })
    );
    setStep(CancellationStep.CANCEL_CONFIRM);
  };
  return (
    <Dialog
      isOpen={isOpen}
      actions={{
        primary: {
          children: translate(I18N_KEYS.CONTINUE_CANCEL),
          onClick: onClickContinueCancelation,
        },
        secondary: {
          children: translate(I18N_KEYS.KEEP_PLAN, { planName }),
          onClick: onClickKeepPremium,
        },
      }}
      closeActionLabel={translate(I18N_KEYS.CLOSE_ACTION_LABEL_A11Y)}
      onClose={handleClickToClose}
      title={translate(I18N_KEYS.HEADER_TITLE)}
    >
      <Paragraph sx={{ marginBottom: "24px" }}>
        {translate.markup(I18N_KEYS.HEADER_PARAGRAPH, {
          planEndDate,
        })}
      </Paragraph>

      <LostFeaturesList
        title={translate(I18N_KEYS.LOSSLIST_TITLE, { planName })}
        capabilities={premiumStatus.data.capabilities}
      />

      <Paragraph as="span">{translate(I18N_KEYS.ALT_OPTIONS)}</Paragraph>
      <LinkButton
        href={DASHLANE_PRICING_PAGE_PERSONAL}
        size="small"
        isExternal
        onClick={() =>
          logEvent(
            new UserClickEvent({
              button: Button.ViewAllPlans,
              clickOrigin: ClickOrigin.CancellationLossAversionModal,
            })
          )
        }
      >
        {translate(I18N_KEYS.COMPARE_PLANS_LINK)}
      </LinkButton>
      <LinkButton
        href={DASHLANE_HELP_CENTER}
        size="small"
        isExternal
        onClick={() =>
          logEvent(
            new UserClickEvent({
              button: Button.CheckHelpCenterForExtraGuidance,
              clickOrigin: ClickOrigin.CancellationLossAversionModal,
            })
          )
        }
      >
        {translate(I18N_KEYS.HELP_CENTER_LINK)}
      </LinkButton>
    </Dialog>
  );
};
