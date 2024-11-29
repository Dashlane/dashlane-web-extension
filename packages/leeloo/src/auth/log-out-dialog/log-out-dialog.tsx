import { useIsMPlessUser } from "../../webapp/account/security-settings/hooks/use-is-mpless-user";
import { Dialog, Paragraph } from "@dashlane/design-system";
import useTranslate from "../../libs/i18n/useTranslate";
import { usePinCodeStatus } from "../../webapp/account/security-settings/security-settings-root/pin-unlock-section/hooks/use-pin-code-status";
import { memo } from "react";
interface LogOutDialogProps {
  isOpen: boolean;
  onDismiss?: () => void;
  onLogout: () => void;
}
export const I18N_KEYS = {
  LOGOUT_DIALOG_TITLE: "webapp_logout_dialog_title",
  LOGOUT_DIALOG_TITLE_NON_MP_BASED_SPECIFIC:
    "webapp_logout_dialog_title_mpless_specific",
  LOGOUT_DIALOG_DESCRIPTION: "webapp_logout_dialog_text",
  LOGOUT_DIALOG_DESCRIPTION_PASSWORDLESS: "webapp_logout_dialog_mpless_text",
  LOGOUT_DIALOG_DESCRIPTION_PASSWORDLESS_PIN_ENABLED:
    "webapp_logout_dialog_pin_text",
  LOGOUT_DIALOG_DESCRIPTION_PIN_UNLOCK:
    "webapp_logout_passwordless_pin_enabled_dialog_text",
  BUTTON_CONFIRM_LOGOUT: "webapp_logout_dialog_confirm",
  BUTTON_DISMISS_DIALOG: "webapp_logout_dialog_dismiss",
  BUTTON_CLOSE_DIALOG_LABEL: "_common_dialog_dismiss_button",
};
export const LogOutDialogRaw = ({
  isOpen,
  onLogout,
  onDismiss,
}: LogOutDialogProps) => {
  const { translate } = useTranslate();
  const { isPinCodeEnabled, isPinCodeStatusLoading } = usePinCodeStatus();
  const isPinCodeUnlockUser = isPinCodeEnabled && !isPinCodeStatusLoading;
  const isPasswordlessUser = useIsMPlessUser().isMPLessUser;
  const defaultAccount = !isPasswordlessUser && !isPinCodeUnlockUser;
  const handleOnLogout = () => {
    onLogout();
  };
  const handleOnDismiss = () => {
    if (onDismiss) {
      onDismiss();
    }
  };
  return (
    <Dialog
      title={
        defaultAccount
          ? translate(I18N_KEYS.LOGOUT_DIALOG_TITLE)
          : translate(I18N_KEYS.LOGOUT_DIALOG_TITLE_NON_MP_BASED_SPECIFIC)
      }
      isOpen={isOpen}
      onClose={handleOnDismiss}
      closeActionLabel={translate(I18N_KEYS.BUTTON_CLOSE_DIALOG_LABEL)}
      isDestructive={isPasswordlessUser}
      actions={{
        primary: {
          children: translate(I18N_KEYS.BUTTON_CONFIRM_LOGOUT),
          onClick: handleOnLogout,
        },
        secondary: {
          children: translate(I18N_KEYS.BUTTON_DISMISS_DIALOG),
          onClick: handleOnDismiss,
        },
      }}
    >
      <Paragraph>
        {defaultAccount ? translate(I18N_KEYS.LOGOUT_DIALOG_DESCRIPTION) : ""}
        {isPasswordlessUser && !isPinCodeUnlockUser
          ? translate(I18N_KEYS.LOGOUT_DIALOG_DESCRIPTION_PASSWORDLESS)
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
export const LogOutDialog = memo(LogOutDialogRaw);
