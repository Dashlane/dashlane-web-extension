import { Button, ClickOrigin, UserClickEvent } from "@dashlane/hermes";
import { Dialog, Paragraph } from "@dashlane/design-system";
import image from "@dashlane/design-system/assets/illustrations/award-winning-customer-service@2x-light.webp";
import useTranslate from "../../../libs/i18n/useTranslate";
import { logEvent } from "../../../libs/logs/logEvent";
const I18N_KEYS = {
  TITLE: "cancel_flow_discount_dialog_title",
  DESCRIPTION: "cancel_flow_discount_dialog_description",
  CONFIRM_CANCELATION_BUTTON:
    "cancel_flow_discount_dialog_confirm_cancelation_button",
  KEEP_PREMIUM_BUTTON: "cancel_flow_discount_dialog_keep_premium_button",
  CLOSE_DIALOG: "_common_dialog_dismiss_button",
};
interface Props {
  onClose: () => void;
  onConfirmCancelation: () => void;
  onUseDiscount: () => void;
}
export const CancelationDiscountDialog = ({
  onClose,
  onConfirmCancelation,
  onUseDiscount,
}: Props) => {
  const { translate } = useTranslate();
  const handleClickConfirmCancelation = () => {
    logEvent(
      new UserClickEvent({
        button: Button.ConfirmCancellation,
        clickOrigin: ClickOrigin.DashlaneTooExpensiveModal,
      })
    );
    onConfirmCancelation();
  };
  const onRedeemOffer = () => {
    logEvent(
      new UserClickEvent({
        button: Button.RedeemOffer,
        clickOrigin: ClickOrigin.DashlaneTooExpensiveModal,
      })
    );
    onUseDiscount();
  };
  return (
    <Dialog
      isOpen={true}
      onClose={onClose}
      closeActionLabel={translate(I18N_KEYS.CLOSE_DIALOG)}
      decorationSlot={image}
      title={translate(I18N_KEYS.TITLE)}
      isDestructive
      isMandatory
      actions={{
        primary: {
          children: translate(I18N_KEYS.CONFIRM_CANCELATION_BUTTON),
          onClick: handleClickConfirmCancelation,
        },
        secondary: {
          children: translate(I18N_KEYS.KEEP_PREMIUM_BUTTON),
          onClick: onRedeemOffer,
        },
      }}
    >
      <Paragraph>{translate(I18N_KEYS.DESCRIPTION)}</Paragraph>
    </Dialog>
  );
};
