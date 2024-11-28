import { useFormik } from "formik";
import { Fragment, FunctionComponent, useEffect } from "react";
import { AuthenticationFlowContracts } from "@dashlane/authentication-contracts";
import { Button, EmailField, jsx } from "@dashlane/design-system";
import { useAnalyticsCommands } from "@dashlane/framework-react";
import { Result } from "@dashlane/framework-types";
import { PageView } from "@dashlane/hermes";
import { EmailHeader } from "../../components";
import { Header } from "../../components/header";
import { PopupLoginLayout } from "../../components/popup-login-layout";
import { FORM_SX_STYLES } from "../../constants";
import { openWebAppAndClosePopup } from "../../../helpers";
import useTranslate from "../../../../libs/i18n/useTranslate";
const I18N_KEYS = {
  CONFIRM: "login/email_confirm_button",
  CREATE_AN_ACCOUNT: "login/email_create_an_account_button",
  EMAIL_PLACEHOLDER: "login/email_placeholder",
  ENTER_YOUR_EMAIL: "login/email_label",
  OTHER_ACCOUNT: "login/action_other_account",
};
const I18N_ERROR_KEYS = {
  INVALID_LOGIN: "login/security_code_error_invalid_email",
  NETWORK_ERROR: "login/security_code_error_network_error",
  SSO_BLOCKED: "login/security_code_error_sso_blocked",
  TEAM_GENERIC_ERROR: "login/security_code_error_team_generic_error",
  UNKNOWN_ERROR: "login/security_code_error_unkown",
  USER_DOESNT_EXIST: "login/security_code_error_unknown_email",
  USER_DOESNT_EXIST_SSO: "login/security_code_error_unknown_email",
  USER_DOESNT_EXIST_UNLIKELY_MX: "login/security_code_error_unknown_email",
  USER_DOESNT_EXIST_INVALID_MX: "login/security_code_error_unknown_email",
};
const USE_ANOTHER_ACCOUNT_OPTION_VALUE = "USE_ANOTHER_ACCOUNT";
const EMAIL_STEP_DESCRIPTION = "emailStepDescription";
const openWebAppSignup = () => {
  void openWebAppAndClosePopup({ route: "/signup" });
};
interface Props
  extends Omit<
    AuthenticationFlowContracts.AuthenticationFlowEmailView,
    "step"
  > {
  sendEmail: (params: { login: string }) => Promise<Result<undefined>>;
  clearInputError: () => void;
}
export const AccountEmailSelect: FunctionComponent<Props> = ({
  loginEmail,
  localAccounts,
  sendEmail,
  isLoading,
  error,
  clearInputError,
}: Props) => {
  const { translate } = useTranslate();
  const { trackPageView } = useAnalyticsCommands();
  useEffect(() => {
    void trackPageView({
      pageView: PageView.LoginEmail,
    });
  }, []);
  useEffect(() => {
    if (error === "USER_DOESNT_EXIST_SSO") {
      openWebAppAndClosePopup({ route: `/signup?email=${loginEmail}` });
    }
  }, [error, loginEmail]);
  const formik = useFormik({
    initialValues: {
      email: loginEmail ?? "",
    },
    onSubmit: ({ email }) => {
      void sendEmail({ login: email });
    },
  });
  const {
    handleSubmit,
    values: { email },
    setFieldValue,
  } = formik;
  const handleEmailChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const {
      target: { value },
    } = e;
    clearInputError();
    if (value === USE_ANOTHER_ACCOUNT_OPTION_VALUE) {
      void setFieldValue("email", "");
    } else {
      void setFieldValue("email", value);
    }
  };
  return (
    <>
      <EmailHeader
        loginEmail={loginEmail ?? ""}
        showAccountsActionsDropdown={false}
        showLogoutDropdown={false}
        localAccounts={localAccounts}
      />

      <form sx={FORM_SX_STYLES} onSubmit={handleSubmit} noValidate>
        <PopupLoginLayout>
          <Header text={translate(I18N_KEYS.ENTER_YOUR_EMAIL)} />
          <EmailField
            name="email"
            label={translate(I18N_KEYS.EMAIL_PLACEHOLDER)}
            value={email}
            type="email"
            onChange={handleEmailChange}
            aria-describedby={EMAIL_STEP_DESCRIPTION}
            disabled={isLoading}
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
          />
        </PopupLoginLayout>

        <Button
          type="submit"
          id="extng-account-email-next-button"
          isLoading={isLoading}
          disabled={!email}
          fullsize
          size="large"
          sx={{ marginBottom: "8px" }}
        >
          {translate(I18N_KEYS.CONFIRM)}
        </Button>
        <Button
          onClick={openWebAppSignup}
          mood="neutral"
          intensity="quiet"
          fullsize
          size="large"
        >
          {translate(I18N_KEYS.CREATE_AN_ACCOUNT)}
        </Button>
      </form>
    </>
  );
};
