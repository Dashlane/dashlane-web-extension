import { useEffect, useState } from "react";
import { useFormik } from "formik";
import { AuthenticationFlowContracts } from "@dashlane/authentication-contracts";
import {
  Button,
  EmailField,
  SelectField,
  SelectOption,
} from "@dashlane/design-system";
import { useAnalyticsCommands } from "@dashlane/framework-react";
import { Result } from "@dashlane/framework-types";
import { PageView } from "@dashlane/hermes";
import { ACCOUNT_CREATION_URL_SEGMENT } from "../../../../app/routes/constants";
import useTranslate from "../../../../libs/i18n/useTranslate";
import { redirect } from "../../../../libs/router";
import { Header, WebappLoginLayout } from "../components";
export const I18N_KEYS = {
  EMAIL_PLACEHOLDER: "webapp_login_form_email_fieldset_email_placeholder",
  HEADING: "webapp_login_form_heading_log_in",
  NEXT: "webapp_login_form_email_fieldset_email_confirm",
  SELECTOR_LABEL: "webapp_login_form_email_fieldset_email_description",
  ACCOUNT_SELECTOR_LABEL: "webapp_login_form_email_fieldset_label",
  USE_ANOTHER_ACCOUNT:
    "webapp_login_form_email_fieldset_select_option_other_account",
};
const I18N_ERROR_KEYS = {
  EMPTY_LOGIN: "webapp_login_form_email_fieldset_error_empty_login",
  INVALID_LOGIN: "webapp_login_form_email_fieldset_error_invalid_login",
  NETWORK_ERROR: "webapp_login_form_email_fieldset_network_error_offline",
  SSO_BLOCKED: "webapp_login_form_email_fieldset_error_sso_blocked",
  TEAM_GENERIC_ERROR:
    "webapp_login_form_email_fieldset_error_team_generic_error",
  THROTTLED: "webapp_login_form_email_fieldset_error_throttled",
  UNKNOWN_ERROR: "webapp_login_form_email_fieldset_error_unknown",
  USER_DOESNT_EXIST: "webapp_login_form_email_fieldset_error_user_doesnt_exist",
  USER_DOESNT_EXIST_SSO:
    "webapp_login_form_email_fieldset_error_user_doesnt_exist",
  USER_DOESNT_EXIST_UNLIKELY_MX:
    "webapp_login_form_email_fieldset_error_user_doesnt_exist_unlikely_mx",
  USER_DOESNT_EXIST_INVALID_MX:
    "webapp_login_form_email_fieldset_error_user_doesnt_exist_invalid_mx",
};
const USE_ANOTHER_ACCOUNT_OPTION_VALUE = "USE_ANOTHER_ACCOUNT";
interface Props
  extends Omit<
    AuthenticationFlowContracts.AuthenticationFlowEmailView,
    "step"
  > {
  clearInputError: () => void;
  sendEmail: (params: { login: string }) => Promise<Result<undefined>>;
  prefilledEmail?: string;
  onClearPrefilledEmail: () => void;
}
export const AccountEmailSelect = ({
  localAccounts,
  sendEmail,
  loginEmail,
  isLoading,
  error,
  clearInputError,
  prefilledEmail,
  onClearPrefilledEmail,
}: Props) => {
  const { translate } = useTranslate();
  const [showEmailDropdown, setShowEmailDropdown] = useState(
    localAccounts &&
      localAccounts.length > 0 &&
      localAccounts.some((account) => account.isLastSuccessfulLogin)
  );
  const { trackPageView } = useAnalyticsCommands();
  useEffect(() => {
    void trackPageView({
      pageView: PageView.LoginEmail,
    });
  }, []);
  const lastSuccessfullyLoggedInAccount = localAccounts.find((account) => {
    return account.isLastSuccessfulLogin;
  });
  const initialEmail =
    loginEmail ?? lastSuccessfullyLoggedInAccount?.login ?? "";
  useEffect(() => {
    if (prefilledEmail) {
      onClearPrefilledEmail();
      sendEmail({ login: prefilledEmail });
    }
  }, [prefilledEmail]);
  useEffect(() => {
    if (error === "USER_DOESNT_EXIST_SSO") {
      clearInputError();
      redirect(`${ACCOUNT_CREATION_URL_SEGMENT}?email=${loginEmail}`);
    }
  }, [error, loginEmail, clearInputError]);
  const formik = useFormik({
    initialValues: {
      email: initialEmail,
    },
    onSubmit: (values) => {
      const { email } = values;
      sendEmail({ login: email });
    },
  });
  const {
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
      setFieldValue("email", "");
      setShowEmailDropdown(false);
    } else {
      setFieldValue("email", value);
    }
  };
  const handleSelectChange = (value: string) => {
    clearInputError();
    if (value === USE_ANOTHER_ACCOUNT_OPTION_VALUE) {
      setFieldValue("email", "");
      setShowEmailDropdown(false);
    } else {
      setFieldValue("email", value);
    }
  };
  return (
    <WebappLoginLayout>
      <Header text={translate(I18N_KEYS.HEADING)} />
      <form
        noValidate
        onSubmit={formik.handleSubmit}
        sx={{ gap: "25px", display: "flex", flexDirection: "column" }}
      >
        {showEmailDropdown && localAccounts ? (
          <SelectField
            label={translate(I18N_KEYS.ACCOUNT_SELECTOR_LABEL)}
            value={initialEmail}
            onChange={(value: string) => handleSelectChange(value)}
            id="login-select"
            data-testid="login_container"
          >
            {localAccounts.map(({ login: localAccountLogin }) => (
              <SelectOption key={localAccountLogin} value={localAccountLogin}>
                {localAccountLogin}
              </SelectOption>
            ))}
            <SelectOption
              key={translate(I18N_KEYS.USE_ANOTHER_ACCOUNT)}
              value={USE_ANOTHER_ACCOUNT_OPTION_VALUE}
            >
              {translate(I18N_KEYS.USE_ANOTHER_ACCOUNT)}
            </SelectOption>
          </SelectField>
        ) : (
          <EmailField
            name="email"
            id="extng-account-email-input"
            value={email}
            type="email"
            onChange={handleEmailChange}
            placeholder={translate(I18N_KEYS.EMAIL_PLACEHOLDER)}
            label={translate(I18N_KEYS.SELECTOR_LABEL)}
            error={!!error}
            feedback={
              error
                ? {
                    id: "login-account-email-input-error",
                    text: translate(
                      I18N_ERROR_KEYS[error] ?? I18N_ERROR_KEYS.UNKNOWN_ERROR
                    ),
                  }
                : undefined
            }
            autoFocus
          />
        )}

        <Button
          type="submit"
          id="extng-account-email-next-button"
          aria-label={translate(I18N_KEYS.NEXT)}
          data-testid="login-button"
          fullsize
          size="large"
          disabled={isLoading}
          isLoading={isLoading}
        >
          {translate(I18N_KEYS.NEXT)}
        </Button>
      </form>
    </WebappLoginLayout>
  );
};
