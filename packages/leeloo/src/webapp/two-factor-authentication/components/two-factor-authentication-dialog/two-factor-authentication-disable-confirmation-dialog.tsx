import React, { useEffect } from "react";
import {
  colors,
  DialogBody,
  DialogFooter,
  Heading,
  Paragraph,
  ThemeUIStyleObject,
} from "@dashlane/ui-components";
import useTranslate from "../../../../libs/i18n/useTranslate";
interface Props {
  handleClickOnSubmit: () => void;
  handleClickOnClose: () => void;
  logEvent?: () => void;
  isTwoFactorAuthenticationEnforced: boolean;
}
const I18N_KEYS = {
  TITLE: "webapp_account_security_settings_2fa_disable_confirm_dialog_title",
  DESCRIPTION:
    "webapp_account_security_settings_2fa_disable_confirm_dialog_description",
  CONFIRM_BUTTON:
    "webapp_account_security_settings_2fa_disable_confirm_dialog_confirm",
  CANCEL_BUTTON: "_common_action_cancel",
  ENFORCED_2FA: {
    TITLE:
      "webapp_account_security_settings_2fa_disable_enforced_by_admin_confirm_dialog_title",
    DESCRIPTION:
      "webapp_account_security_settings_2fa_disable_enforced_by_admin_confirm_dialog_description_markup",
    CONTINUE_BUTTON: "_common_action_continue",
  },
};
const dialogDescriptionStyle: ThemeUIStyleObject = {
  marginTop: "16px",
  color: colors.grey00,
  "p:first-child": { marginBottom: "16px" },
};
export const TwoFactorAuthenticationDisableConfirmationDialog = ({
  handleClickOnClose,
  handleClickOnSubmit,
  logEvent,
  isTwoFactorAuthenticationEnforced,
}: Props) => {
  const { translate } = useTranslate();
  useEffect(() => {
    logEvent?.();
  }, []);
  return (
    <div
      sx={{
        maxWidth: "480px",
      }}
    >
      <DialogBody>
        <Heading
          size="small"
          sx={{ marginTop: "20px", color: colors.black }}
          data-testid="two-factor-authentication-disable-confirmation-dialog-title"
        >
          {translate(
            isTwoFactorAuthenticationEnforced
              ? I18N_KEYS.ENFORCED_2FA.TITLE
              : I18N_KEYS.TITLE
          )}
        </Heading>
        <Paragraph size="small" as="div" sx={dialogDescriptionStyle}>
          {isTwoFactorAuthenticationEnforced
            ? translate.markup(I18N_KEYS.ENFORCED_2FA.DESCRIPTION)
            : translate(I18N_KEYS.DESCRIPTION)}
        </Paragraph>
      </DialogBody>
      <DialogFooter
        primaryButtonTitle={translate(
          isTwoFactorAuthenticationEnforced
            ? I18N_KEYS.ENFORCED_2FA.CONTINUE_BUTTON
            : I18N_KEYS.CONFIRM_BUTTON
        )}
        primaryButtonProps={{
          type: "button",
          autoFocus: true,
        }}
        primaryButtonOnClick={() => handleClickOnSubmit()}
        secondaryButtonTitle={translate(I18N_KEYS.CANCEL_BUTTON)}
        secondaryButtonOnClick={() => handleClickOnClose()}
      />
    </div>
  );
};
