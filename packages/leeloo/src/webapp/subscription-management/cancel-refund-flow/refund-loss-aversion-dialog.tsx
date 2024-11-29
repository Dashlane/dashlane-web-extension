import { Dispatch, SetStateAction } from "react";
import { PremiumStatus } from "@dashlane/communication";
import { Dialog, Paragraph } from "@dashlane/design-system";
import { CallToAction, UserCallToActionEvent } from "@dashlane/hermes";
import useTranslate from "../../../libs/i18n/useTranslate";
import { logEvent } from "../../../libs/logs/logEvent";
import { LostFeaturesList } from "./lost-features-list";
import { getTranslatedPlanName } from "../plan-information/helpers";
interface Props {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  refundHandler: () => void;
  premiumStatusData: PremiumStatus;
}
const I18N_KEYS = {
  CANCEL: "manage_subscription_plan_loss_aversion_dialog_cancel",
  CLOSE_ACTION_LABEL_A11Y:
    "manage_subscription_plan_loss_aversion_dialog_close_label_a11y",
  CONFIRM: "manage_subscription_plan_loss_aversion_dialog_confirm_request",
  HEADER_PARAGRAPH:
    "manage_subscription_plan_loss_aversion_dialog_refund_header_paragraph",
  HEADER_TITLE:
    "manage_subscription_plan_loss_aversion_dialog_refund_header_title",
  LOSSLIST_TITLE:
    "manage_subscription_plan_loss_aversion_dialog_refund_losslist_title",
};
export const RefundLossAversionDialog = ({
  isOpen,
  refundHandler,
  setIsOpen,
  premiumStatusData,
}: Props) => {
  const { translate } = useTranslate();
  const planName = getTranslatedPlanName(premiumStatusData, translate);
  const handleClose = () => setIsOpen(false);
  const handleClickToClose = () => {
    logEvent(
      new UserCallToActionEvent({
        callToActionList: [
          CallToAction.ConfirmRefundRequest,
          CallToAction.AbandonRefundRequest,
        ],
        hasChosenNoAction: true,
      })
    );
    handleClose();
  };
  const handleCancel = () => {
    logEvent(
      new UserCallToActionEvent({
        chosenAction: CallToAction.AbandonRefundRequest,
        callToActionList: [
          CallToAction.ConfirmRefundRequest,
          CallToAction.AbandonRefundRequest,
        ],
        hasChosenNoAction: false,
      })
    );
    handleClose();
  };
  const handleConfirmRefund = () => {
    logEvent(
      new UserCallToActionEvent({
        chosenAction: CallToAction.ConfirmRefundRequest,
        callToActionList: [
          CallToAction.ConfirmRefundRequest,
          CallToAction.AbandonRefundRequest,
        ],
        hasChosenNoAction: false,
      })
    );
    refundHandler();
  };
  return (
    <Dialog
      isOpen={isOpen}
      actions={{
        primary: {
          children: translate(I18N_KEYS.CONFIRM),
          onClick: handleConfirmRefund,
        },
        secondary: {
          children: translate(I18N_KEYS.CANCEL),
          onClick: handleCancel,
        },
      }}
      closeActionLabel={translate(I18N_KEYS.CLOSE_ACTION_LABEL_A11Y)}
      onClose={handleClickToClose}
      title={translate(I18N_KEYS.HEADER_TITLE)}
    >
      <Paragraph sx={{ marginBottom: "24px" }}>
        {translate(I18N_KEYS.HEADER_PARAGRAPH, { planName })}
      </Paragraph>

      <LostFeaturesList
        title={translate(I18N_KEYS.LOSSLIST_TITLE)}
        capabilities={premiumStatusData.capabilities}
      />
    </Dialog>
  );
};
