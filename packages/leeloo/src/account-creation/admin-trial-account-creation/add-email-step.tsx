import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import {
  Button,
  EmailField,
  Flex,
  IndeterminateLoader,
  LinkButton,
  Paragraph,
} from "@dashlane/design-system";
import { PageView } from "@dashlane/hermes";
import useTranslate from "../../libs/i18n/useTranslate";
import { isValidEmail } from "../../libs/validators";
import { useHistory, useRouterGlobalSettingsContext } from "../../libs/router";
import { logPageView } from "../../libs/logs/logEvent";
import { LOGIN_URL_SEGMENT } from "../../app/routes/constants";
import { Lee } from "../../lee";
import { useAccountCreationForm } from "../hooks/use-account-creation-form";
import {
  InfoSubmitOptions,
  LoginErrorTypes,
} from "../account-creation-form/info-form/email-input-form";
import {
  handleInfoFormSubmitted,
  InfoFormFields,
} from "../account-creation-form/info-form/handle-form-submitted";
import { StepCard } from "./step-card/step-card";
const I18N_KEYS = {
  CARD_TITLE: "webapp_auth_panel_add_email_title",
  CARD_DESCRIPTION: "webapp_auth_panel_add_email_description",
  FIELD_LABEL: "webapp_auth_panel_add_email_label",
  FIELD_PLACEHOLDER: "webapp_auth_panel_add_email_placeholder",
  CONTINUE_BUTTON: "webapp_auth_panel_continue",
  ALREADY_USE_DASHLANE: "webapp_auth_panel_already_an_account",
  LOGIN_BUTTON: "webapp_auth_panel_login",
};
const I18N_ERROR_KEYS: Record<LoginErrorTypes, string> = {
  [LoginErrorTypes.SSO_USER_NON_PROVISIONED]:
    "standalone_account_creation_error_sso_user_non_provisioned",
  [LoginErrorTypes.INVALID_EMAIL]:
    "standalone_account_creation_error_invalid_email",
  [LoginErrorTypes.FAILED]: "standalone_account_creation_error_failed",
  [LoginErrorTypes.USER_NOT_PROPOSED]:
    "standalone_account_creation_error_sso_user_non_proposed",
  [LoginErrorTypes.TEAM_ACCEPTANCE_NEEDED]:
    "standalone_account_creation_error_invite_link_not_accepted",
  [LoginErrorTypes.TEAM_ACCEPTANCE_FAILED]:
    "standalone_account_creation_error_invite_link_acceptance_failed",
};
interface Props {
  lee: Lee;
  loginValue: string;
  setLoginValue: (loginValue: string) => void;
  onSubmit: (info: InfoSubmitOptions) => void;
  hasBeenRedirected: boolean;
  setHasBeenRedirected: (hasBeenRedirected: boolean) => void;
}
export const AddEmailStep = ({
  lee,
  loginValue,
  setLoginValue,
  onSubmit,
  hasBeenRedirected,
  setHasBeenRedirected,
}: Props) => {
  const { translate } = useTranslate();
  const history = useHistory();
  const { routes } = useRouterGlobalSettingsContext();
  const { emailQueryParam } = useAccountCreationForm();
  const [isLoading, setIsLoading] = useState(false);
  const emailField = useRef<HTMLInputElement>(null);
  const [loginErrorType, setLoginErrorType] = useState<LoginErrorTypes | null>(
    null
  );
  useEffect(() => {
    logPageView(PageView.AccountCreationEmail);
  }, []);
  useEffect(() => {
    emailField.current?.focus?.();
  }, []);
  const getEmail = (): string => {
    return (
      emailQueryParam ||
      (emailField?.current?.value ?? "")
    ).toLocaleLowerCase();
  };
  const handleLoginChanged = () => {
    const email = getEmail();
    setLoginErrorType(null);
    setLoginValue(email);
  };
  const handleLoginBlurred = () => {
    setLoginErrorType(
      !loginValue || isValidEmail(loginValue)
        ? null
        : LoginErrorTypes.INVALID_EMAIL
    );
  };
  const makeInfoFormFields = (): InfoFormFields => {
    return {
      email: getEmail(),
      isB2B: true,
    };
  };
  const handleSubmit = useCallback(
    (event?: FormEvent<HTMLFormElement>): boolean => {
      event?.preventDefault();
      const infoFormFields = makeInfoFormFields();
      handleInfoFormSubmitted({
        lee: lee,
        onSubmit: onSubmit,
        fields: infoFormFields,
        setIsLoading,
        setLoginErrorType,
        isInviteLinkFlow: false,
      });
      return false;
    },
    [makeInfoFormFields, onSubmit]
  );
  useEffect(() => {
    if (emailQueryParam) {
      setHasBeenRedirected(true);
      handleSubmit();
    }
  }, [handleSubmit, hasBeenRedirected, emailQueryParam, setHasBeenRedirected]);
  const _getErrorText = (errorType: LoginErrorTypes | null) => {
    if (!errorType) {
      return null;
    }
    let error;
    if (errorType === LoginErrorTypes.SSO_USER_NON_PROVISIONED) {
      const userEmail = getEmail();
      const domain = userEmail.slice(userEmail.indexOf("@") + 1);
      error = translate(
        I18N_ERROR_KEYS[LoginErrorTypes.SSO_USER_NON_PROVISIONED],
        {
          domain,
        }
      );
    } else {
      error = translate(I18N_ERROR_KEYS[errorType]);
    }
    return error;
  };
  const loginErrorText = _getErrorText(loginErrorType);
  return (
    <StepCard
      title={translate(I18N_KEYS.CARD_TITLE)}
      description={translate(I18N_KEYS.CARD_DESCRIPTION)}
    >
      <Flex
        as="form"
        autoComplete="off"
        noValidate
        onSubmit={handleSubmit}
        flexDirection="column"
        gap="24px"
      >
        <EmailField
          required
          ref={emailField}
          label={translate(I18N_KEYS.FIELD_LABEL)}
          placeholder={translate(I18N_KEYS.FIELD_PLACEHOLDER)}
          onBlur={handleLoginBlurred}
          onChange={handleLoginChanged}
          value={loginValue}
          feedback={
            loginErrorText
              ? {
                  id: "error-message",
                  text: loginErrorText,
                }
              : undefined
          }
        />

        <Button
          fullsize
          size="large"
          mood="brand"
          intensity="catchy"
          type="submit"
          disabled={isLoading || !loginValue}
          data-testid="login-button"
        >
          {isLoading ? (
            <IndeterminateLoader />
          ) : (
            translate(I18N_KEYS.CONTINUE_BUTTON)
          )}
        </Button>

        <Flex flexDirection="column" gap="4px" alignItems="center">
          <Paragraph color="ds.text.neutral.quiet">
            {translate(I18N_KEYS.ALREADY_USE_DASHLANE)}
          </Paragraph>
          <LinkButton
            onClick={() =>
              history.push(routes.teamRoutesBasePath + LOGIN_URL_SEGMENT)
            }
          >
            {translate(I18N_KEYS.LOGIN_BUTTON)}
          </LinkButton>
        </Flex>
      </Flex>
    </StepCard>
  );
};
