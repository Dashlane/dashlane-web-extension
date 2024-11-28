import React from "react";
import { Dialog, Paragraph } from "@dashlane/design-system";
import useTranslate from "../../../libs/i18n/useTranslate";
interface LogOutDialogProps {
  isOpen: boolean;
  isPinCodeUnlockUser: boolean;
  isPasswordlessUser: boolean;
  onDismiss: () => void;
  onLogout: () => void;
}
export const I18N_KEYS = {
  LOGOUT_DIALOG_TITLE: "popup_logout_dialog_title_mpless_specific",
  LOGOUT_DIALOG_DESCRIPTION_MPLESS: "popup_logout_mpless_dialog_text",
  LOGOUT_DIALOG_DESCRIPTION_PIN_UNLOCK: "popup_logout_dialog_pin_unlock_text",
  LOGOUT_DIALOG_DESCRIPTION_PASSWORDLESS_PIN_ENABLED:
    "popup_logout_passwordless_pin_enabled_dialog_text",
  BUTTON_CONFIRM_LOGOUT: "footer/button_logout",
  BUTTON_DISMISS_DIALOG: "popup_common_action_cancel",
  BUTTON_CLOSE_DIALOG_LABEL: "webapp_account_recovery_generic_error_dismiss",
};
export const LogOutDialog = ({
  isOpen,
  isPasswordlessUser,
  isPinCodeUnlockUser,
  onLogout,
  onDismiss,
}: LogOutDialogProps) => {
  const { translate } = useTranslate();
  return (
    <Dialog
      title={translate(I18N_KEYS.LOGOUT_DIALOG_TITLE)}
      isOpen={isOpen}
      onClose={onDismiss}
      closeActionLabel={translate(I18N_KEYS.BUTTON_CLOSE_DIALOG_LABEL)}
      isDestructive={isPasswordlessUser}
      actions={{
        primary: {
          children: translate(I18N_KEYS.BUTTON_CONFIRM_LOGOUT),
          onClick: onLogout,
        },
        secondary: {
          children: translate(I18N_KEYS.BUTTON_DISMISS_DIALOG),
          onClick: onDismiss,
        },
      }}
    >
      <Paragraph>
        {isPasswordlessUser && !isPinCodeUnlockUser
          ? translate(I18N_KEYS.LOGOUT_DIALOG_DESCRIPTION_MPLESS)
          : ""}
        {isPasswordlessUser && isPinCodeUnlockUser
          ? translate(
              I18N_KEYS.LOGOUT_DIALOG_DESCRIPTION_PASSWORDLESS_PIN_ENABLED
            )
          : ""}
        {isPinCodeUnlockUser && !isPasswordlessUser
          ? translate(I18N_KEYS.LOGOUT_DIALOG_DESCRIPTION_PIN_UNLOCK)
          : ""}
      </Paragraph>
    </Dialog>
  );
};
