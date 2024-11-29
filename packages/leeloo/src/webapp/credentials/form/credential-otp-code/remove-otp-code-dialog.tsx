import { Dialog, Paragraph } from "@dashlane/design-system";
import useTranslate from "../../../../libs/i18n/useTranslate";
interface Props {
  onCancel: () => void;
  onSubmit: () => void;
  isOpen: boolean;
}
const I18N_KEYS = {
  TITLE: "webapp_credential_otp_code_remove_dialog_title",
  DESCRIPTION: "webapp_credential_otp_code_remove_dialog_description",
  CONFIRM_BUTTON: "webapp_credential_otp_code_remove_dialog_confirm_button",
  CANCEL_BUTTON: "webapp_credential_otp_code_remove_dialog_cancel_button",
};
export const RemoveOtpCodeDialog = ({ onCancel, onSubmit, isOpen }: Props) => {
  const { translate } = useTranslate();
  return (
    <Dialog
      isOpen={isOpen}
      actions={{
        primary: {
          children: translate(I18N_KEYS.CONFIRM_BUTTON),
          onClick: onSubmit,
        },
        secondary: {
          children: translate(I18N_KEYS.CANCEL_BUTTON),
        },
      }}
      isDestructive
      closeActionLabel={translate(I18N_KEYS.CANCEL_BUTTON)}
      onClose={onCancel}
      title={translate(I18N_KEYS.TITLE)}
    >
      <Paragraph>{translate(I18N_KEYS.DESCRIPTION)}</Paragraph>
    </Dialog>
  );
};
