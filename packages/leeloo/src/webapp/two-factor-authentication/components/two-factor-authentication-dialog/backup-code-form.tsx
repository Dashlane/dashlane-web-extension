import React from "react";
import { DialogTitle, Paragraph, TextInput } from "@dashlane/ui-components";
import { colors } from "@dashlane/design-system";
import useTranslate from "../../../../libs/i18n/useTranslate";
import {
  NavLink,
  useRouterGlobalSettingsContext,
} from "../../../../libs/router";
const I18N_KEYS = {
  BACKUP_TITLE:
    "webapp_account_security_settings_two_factor_authentication_backup_code_title",
  BACKUP_CONTENT: "webapp_two_factor_authentication_use_backup_codes",
  BACKUP_LINK: "webapp_two_factor_authentication_use_6_digits_code",
  BACKUP_LABEL: "webapp_two_factor_authentication_backup_code_label",
  SECURITY_CODE_LOST_BACKUP_CODES:
    "webapp_two_factor_authentication_lost_your_backup_codes",
  SECURITY_CODE_LOST_PHONE_LINK: "webapp_two_factor_authentication_reset_2fa",
  SECURITY_CODE_CANT_ACCESS_BACKUP_CODES:
    "webapp_two_factor_authentication_cant_access_your_backup_codes",
};
interface Props {
  handleAuthenticatorModeClick: () => void;
  updateAuthenticatorCode: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  code: string;
  errorMessage?: string;
  login: string;
}
export const BackupCodeForm = ({
  handleAuthenticatorModeClick,
  code,
  updateAuthenticatorCode,
  errorMessage,
  login,
}: Props) => {
  const { translate } = useTranslate();
  const { routes } = useRouterGlobalSettingsContext();
  return (
    <div
      sx={{
        maxWidth: "480px",
      }}
    >
      <DialogTitle
        title={
          <span
            sx={{
              display: "inline-block",
              marginBottom: "16px",
              fontWeight: "500",
              fontSize: "25px",
            }}
          >
            {translate(I18N_KEYS.BACKUP_TITLE)}
          </span>
        }
      />
      <Paragraph
        color={colors.lightTheme.ds.text.inverse.quiet}
        sx={{
          marginBottom: "26px",
        }}
      >
        {translate(I18N_KEYS.BACKUP_CONTENT)}{" "}
      </Paragraph>
      <TextInput
        autoFocus={true}
        type="text"
        data-testid="two-factor-authentication-backup-code"
        fullWidth
        label={translate(I18N_KEYS.BACKUP_LABEL)}
        value={code}
        onChange={updateAuthenticatorCode}
        feedbackType={errorMessage ? "error" : undefined}
        feedbackText={errorMessage ? translate(errorMessage) : undefined}
      />

      <Paragraph
        sx={{
          marginTop: "16px",
          lineHeight: "initial",
          padding: "4px 0px",
        }}
        color={colors.lightTheme.ds.text.inverse.quiet}
      >
        {translate(I18N_KEYS.SECURITY_CODE_CANT_ACCESS_BACKUP_CODES)}{" "}
        <button
          type="button"
          onClick={handleAuthenticatorModeClick}
          sx={{
            fontSize: "15px",
            fontWeight: 500,
            color: colors.lightTheme.ds.text.brand.standard,
            textDecoration: "underline",
            padding: "0px",
            background: "none",
            borderRadius: "4px",
            border: 0,
            outlineOffset: "3px",
            outlineColor: colors.lightTheme.ds.oddity.focus,
            "&:hover": {
              textDecoration: "none",
            },
            "&:focus": {
              border: 1,
            },
          }}
        >
          {translate(I18N_KEYS.BACKUP_LINK)}
        </button>
      </Paragraph>
      <Paragraph
        sx={{
          lineHeight: "initial",
          padding: "4px 0px",
        }}
        color={colors.lightTheme.ds.text.inverse.quiet}
      >
        {translate(I18N_KEYS.SECURITY_CODE_LOST_BACKUP_CODES)}{" "}
        <NavLink
          color="ds.text.brand.standard"
          to={routes.recover2faCodes(login)}
          target="_blank"
          rel="noopener noreferrer"
        >
          {translate(I18N_KEYS.SECURITY_CODE_LOST_PHONE_LINK)}
        </NavLink>
      </Paragraph>
    </div>
  );
};
