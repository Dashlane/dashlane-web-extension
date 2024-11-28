import { useFormik } from "formik";
import { Fragment, FunctionComponent, useRef } from "react";
import { AuthenticationFlowContracts } from "@dashlane/authentication-contracts";
import {
  Button,
  jsx,
  LinkButton,
  Paragraph,
  TextField,
} from "@dashlane/design-system";
import { Result } from "@dashlane/framework-types";
import { EmailHeader } from "../components";
import { Header } from "../components/header";
import { PopupLoginLayout } from "../components/popup-login-layout";
import { FORM_SX_STYLES } from "../constants";
import useTranslate from "../../../libs/i18n/useTranslate";
import { getLostbackupCodesUrl } from "../../../libs/extension-urls";
const I18N_KEYS = {
  TITLE: "login/otp_backup_code_title",
  DESCRIPTION: "login/otp_backup_code_description",
  CANCEL: "popup_common_action_cancel",
  CONFIRM: "_common_action_confirm",
  CODES_LOST: "login/otp_backup_code_lost_text",
  CODES_LOST_LINK: "login/otp_backup_code_lost_link",
  SECURITY_CODE_BACKUP_CODE_LABEL:
    "popup_two_factor_authentication_backup_code_label",
};
const I18N_ERROR_KEYS = {
  EMPTY_OTP: "login/security_code_error_empty_otp",
  OTP_NOT_VALID: "login/security_code_error_otp_not_valid",
  OTP_ALREADY_USED: "login/otp_backup_code_error_already_used",
  OTP_TOO_MANY_ATTEMPTS: "login/security_code_error_token_too_many_attempts",
  NETWORK_ERROR: "login/security_code_error_network_error",
  UNKNOWN_ERROR: "popup_common_generic_error",
};
interface Props
  extends Omit<
    AuthenticationFlowContracts.AuthenticationFlowTwoFactorAuthenticationOtpView,
    "step"
  > {
  submitBackupCode: (params: {
    twoFactorAuthenticationOtpValue: string;
  }) => Promise<Result<undefined>>;
  changeTwoFactorAuthenticationOtpType: (params: {
    twoFactorAuthenticationOtpType: AuthenticationFlowContracts.AuthenticationFlowTwoFactorAuthenticationOtpType;
  }) => Promise<Result<undefined>>;
}
export const AccountBackupCode: FunctionComponent<Props> = ({
  loginEmail,
  isLoading,
  error,
  changeTwoFactorAuthenticationOtpType,
  submitBackupCode,
  localAccounts,
}: Props) => {
  const lostBackupCodesUrl = getLostbackupCodesUrl(loginEmail);
  const { translate } = useTranslate();
  const inputRef = useRef<HTMLInputElement>(null);
  const {
    setFieldValue,
    handleSubmit,
    values: { twoFactorAuthenticationOtpValue },
  } = useFormik({
    initialValues: {
      twoFactorAuthenticationOtpValue: "",
    },
    onSubmit: ({ twoFactorAuthenticationOtpValue }) => {
      void submitBackupCode({
        twoFactorAuthenticationOtpValue,
      });
      inputRef.current?.focus();
    },
  });
  const onTokenInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const {
      target: { value },
    } = e;
    void setFieldValue("twoFactorAuthenticationOtpValue", value);
  };
  return (
    <>
      <EmailHeader
        loginEmail={loginEmail ?? ""}
        showAccountsActionsDropdown
        showLogoutDropdown={false}
        localAccounts={localAccounts}
      />
      <form sx={FORM_SX_STYLES} onSubmit={handleSubmit} noValidate>
        <Header text={translate(I18N_KEYS.TITLE)} />
        <PopupLoginLayout>
          <Paragraph
            color="ds.text.neutral.quiet"
            sx={{
              marginBottom: "16px",
            }}
          >
            {translate(I18N_KEYS.DESCRIPTION)}
          </Paragraph>
          <TextField
            value={twoFactorAuthenticationOtpValue}
            label={translate(I18N_KEYS.SECURITY_CODE_BACKUP_CODE_LABEL)}
            onChange={onTokenInputChange}
            error={!!error}
            ref={inputRef}
            feedback={
              error
                ? {
                    id: "login-feedback-text",
                    text: translate(
                      error in I18N_ERROR_KEYS
                        ? I18N_ERROR_KEYS[error as keyof typeof I18N_ERROR_KEYS]
                        : I18N_ERROR_KEYS.UNKNOWN_ERROR
                    ),
                  }
                : undefined
            }
            autoFocus
            aria-labelledby="backupCode"
            data-testid="auth-backup-code-input"
          />

          <Paragraph sx={{ marginTop: "24px" }}>
            {translate(I18N_KEYS.CODES_LOST)}
          </Paragraph>
          <LinkButton href={lostBackupCodesUrl}>
            {translate(I18N_KEYS.CODES_LOST_LINK)}
          </LinkButton>
        </PopupLoginLayout>

        <Button
          type="submit"
          isLoading={isLoading}
          aria-label={translate(I18N_KEYS.CONFIRM)}
          disabled={!twoFactorAuthenticationOtpValue}
          fullsize
          size="large"
          sx={{ marginBottom: "8px" }}
        >
          {translate(I18N_KEYS.CONFIRM)}
        </Button>
        <Button
          onClick={() => {
            void changeTwoFactorAuthenticationOtpType({
              twoFactorAuthenticationOtpType: "totp",
            });
          }}
          mood="neutral"
          intensity="quiet"
          fullsize
          size="large"
        >
          {translate(I18N_KEYS.CANCEL)}
        </Button>
      </form>
    </>
  );
};
