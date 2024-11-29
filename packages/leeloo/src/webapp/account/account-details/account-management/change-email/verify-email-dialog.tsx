import { ReactNode, useState } from "react";
import {
  Dialog,
  ExpressiveIcon,
  LinkButton,
  Paragraph,
  PinField,
} from "@dashlane/design-system";
import useTranslate from "../../../../../libs/i18n/useTranslate";
import { allIgnoreClickOutsideClassName } from "../../../../variables";
import { PIN_CODE_LENGTH } from "../../../../../pin-code/constants";
type Props = {
  isOpen: boolean;
  title: string;
  description?: string | ReactNode;
  submitLabel: string;
  onSubmit: (verificationCode: string) => void;
  onCancel: () => void;
  resendVerificationCode: () => void;
};
const I18N_KEYS = {
  CANCEL_BUTTON: "_common_action_cancel",
  CLOSE_BUTTON: "_common_dialog_dismiss_button",
  DIDNT_RECEIVE_EMAIL_LABEL:
    "webapp_change_login_email_verify_dialog_helper_text",
  RESEND_EMAIL_LINK: "webapp_change_login_email_verify_dialog_resend_email",
};
export const VerifyEmailDialog = ({
  isOpen,
  title,
  description,
  submitLabel,
  onSubmit,
  onCancel,
  resendVerificationCode,
}: Props) => {
  const { translate } = useTranslate();
  const [verificationCode, setVerificationCode] = useState("");
  return (
    <Dialog
      dialogClassName={allIgnoreClickOutsideClassName}
      title={title}
      isOpen={isOpen}
      decorationSlot={
        <ExpressiveIcon mood="warning" name="ItemEmailOutlined" size="xlarge" />
      }
      closeActionLabel={translate(I18N_KEYS.CLOSE_BUTTON)}
      onClose={onCancel}
      actions={{
        primary: {
          children: submitLabel,
          onClick: () => onSubmit(verificationCode),
          disabled: verificationCode.length < PIN_CODE_LENGTH,
        },
        secondary: {
          children: translate(I18N_KEYS.CANCEL_BUTTON),
          onClick: onCancel,
        },
      }}
    >
      <Paragraph color="ds.text.neutral.standard" sx={{ marginBottom: "16px" }}>
        {description}
      </Paragraph>
      <PinField
        label="Verification code"
        isPinVisible
        autoClear={false}
        onPinComplete={(value) => setVerificationCode(value)}
      />
      <div sx={{ display: "flex", alignItems: "center" }}>
        <Paragraph
          color="ds.text.neutral.quiet"
          textStyle="ds.body.reduced.regular"
        >
          {translate(I18N_KEYS.DIDNT_RECEIVE_EMAIL_LABEL)}&nbsp;
        </Paragraph>

        <LinkButton onClick={resendVerificationCode} sx={{ marginLeft: "8px" }}>
          <Paragraph
            textStyle="ds.body.reduced.link"
            color="ds.text.brand.standard"
          >
            {translate(I18N_KEYS.RESEND_EMAIL_LINK)}
          </Paragraph>
        </LinkButton>
      </div>
    </Dialog>
  );
};
