import React from "react";
import {
  Dialog,
  DialogBody,
  DialogFooter,
  Heading,
} from "@dashlane/ui-components";
import useTranslate from "../../libs/i18n/useTranslate";
import { PasswordTipsContent } from "../../password-tips-content/password-tips-content";
const I18N_KEYS = {
  TITLE: "webapp_account_security_settings_passwordtips_panel_subtitle",
  GOT_IT: "webapp_password_tips_dialog_got_it",
  CLOSE: "_common_dialog_dismiss_button",
};
interface PasswordTipsDialogProps {
  showPasswordTipsDialog: boolean;
  handleDismiss: () => void;
}
export const PasswordTipsDialog = ({
  showPasswordTipsDialog,
  handleDismiss,
}: PasswordTipsDialogProps) => {
  const { translate } = useTranslate();
  return (
    <Dialog
      closeIconName={translate(I18N_KEYS.CLOSE)}
      isOpen={showPasswordTipsDialog}
      onClose={handleDismiss}
    >
      <Heading size="small">{translate(I18N_KEYS.TITLE)}</Heading>
      <DialogBody>
        <PasswordTipsContent />
      </DialogBody>
      <DialogFooter
        primaryButtonTitle={translate(I18N_KEYS.GOT_IT)}
        primaryButtonOnClick={handleDismiss}
      />
    </Dialog>
  );
};
