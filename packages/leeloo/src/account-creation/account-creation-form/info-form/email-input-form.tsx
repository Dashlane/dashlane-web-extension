import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { LoadingIcon } from "@dashlane/ui-components";
import {
  InvitationLinkClickOrigin,
  PageView,
  SignupFlowStep,
  UserSignupToDashlaneEvent,
} from "@dashlane/hermes";
import {
  Button,
  Flex,
  Heading,
  Infobox,
  Paragraph,
  TextInput,
} from "@dashlane/design-system";
import { DataStatus, useModuleCommands } from "@dashlane/framework-react";
import { confidentialSSOApi } from "@dashlane/sso-scim-contracts";
import { Lee } from "../../../lee";
import { isValidEmail } from "../../../libs/validators";
import {
  handleInfoFormSubmitted,
  InfoFormFields,
} from "./handle-form-submitted";
import useTranslate from "../../../libs/i18n/useTranslate";
import { useLocation } from "../../../libs/router";
import { logEvent, logPageView } from "../../../libs/logs/logEvent";
import { getSignUpUrlQueryParameters } from "../../helpers";
import { useTeamSignupInviteLink } from "../../hooks/use-team-signup-invite-link";
export interface InfoSubmitOptions {
  login: string | null;
  isProposedExpired: boolean | undefined;
  isUserProposed: boolean | undefined;
  isUserAccepted: boolean | undefined;
}
interface EmailInputFormProps {
  lee: Lee;
  onSubmit: (info: InfoSubmitOptions) => void;
  isB2BFlow: boolean;
  hasBeenRedirected: boolean;
  setHasBeenRedirected: (hasBeenRedirected: boolean) => void;
  loginErrorType: LoginErrorTypes | null;
  setLoginErrorType: (loginError: LoginErrorTypes | null) => void;
  loginValue: string;
  setLoginValue: (loginValue: string) => void;
  isEmployeeSignUpFlow: boolean;
  isAcceptTeamInviteCheckDone: boolean;
}
const I18N_KEYS = {
  EMAIL_INPUT_LABEL_GENERIC:
    "webapp_auth_panel_standalone_account_creation_email_label",
  EMAIL_INPUT_PLACEHOLDER:
    "webapp_auth_panel_standalone_account_creation_email_placeholder",
  NEXT_BUTTON_TEXT:
    "webapp_auth_panel_standalone_account_creation_step1_confirm_button",
  EMAIL_INPUT_LABEL_COMPANY:
    "webapp_auth_panel_standalone_account_creation_email_invite_link_label",
  RE_SEND_EMAIL_BUTTON:
    "webapp_auth_panel_standalone_account_creation_invite_link_resend_button",
  EMPLOYEE_SIGN_UP_HEADER: "webapp_auth_panel_account_creation_employee_header",
  SUBHEADER: "webapp_auth_panel_standalone_account_creation_step1_sub_header",
  HEADER: "webapp_auth_panel_standalone_account_creation_step1_header",
  DISABLED_INFOBOX_TITLE:
    "webapp_account_creation_invite_link_disabled_info_title",
  DISABLED_INFOBOX_DESCRIPTION:
    "webapp_account_creation_invite_link_disabled_info_description",
};
export enum LoginErrorTypes {
  SSO_USER_NON_PROVISIONED = "sso_user_non_provisioned",
  INVALID_EMAIL = "invalid_email",
  FAILED = "failed",
  USER_NOT_PROPOSED = "user_non_proposed",
  TEAM_ACCEPTANCE_NEEDED = "team_acceptance_needed",
  TEAM_ACCEPTANCE_FAILED = "team_acceptance_failed",
}
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
export const EmailInputForm = ({
  onSubmit,
  lee,
  isB2BFlow,
  hasBeenRedirected,
  setHasBeenRedirected,
  loginErrorType,
  setLoginErrorType,
  loginValue,
  setLoginValue,
  isEmployeeSignUpFlow,
  isAcceptTeamInviteCheckDone,
}: EmailInputFormProps) => {
  const { search } = useLocation();
  const { translate } = useTranslate();
  const { emailQueryParam, prefilledTeamKey, isFromMassDeployment } =
    getSignUpUrlQueryParameters(search);
  const teamInviteLinkData = useTeamSignupInviteLink(prefilledTeamKey);
  const [isLoading, setIsLoading] = useState(false);
  const emailField = useRef<HTMLInputElement>(null);
  const { loginUserWithEnclaveSSO } = useModuleCommands(confidentialSSOApi);
  const isInviteLinkFlow = isEmployeeSignUpFlow && !!prefilledTeamKey;
  const isInviteLinkDisabled =
    isInviteLinkFlow &&
    teamInviteLinkData.status === DataStatus.Success &&
    teamInviteLinkData.disabled;
  useEffect(() => {
    emailField.current?.focus?.();
  }, []);
  useEffect(() => {
    if (isEmployeeSignUpFlow) {
      logPageView(PageView.JoinDashlaneTeamEnterEmailAddress);
      logEvent(
        new UserSignupToDashlaneEvent({
          invitationLinkClickOrigin: isFromMassDeployment
            ? InvitationLinkClickOrigin.ExtensionMassDeployment
            : isInviteLinkFlow
            ? InvitationLinkClickOrigin.SharedInvitationLink
            : InvitationLinkClickOrigin.InvitationEmail,
          signupFlowStep: SignupFlowStep.EnterEmailAddress,
        })
      );
    }
  }, [isEmployeeSignUpFlow, isFromMassDeployment, isInviteLinkFlow]);
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
      isB2B: isB2BFlow,
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
        loginUserWithEnclaveSSO,
        isInviteLinkFlow,
      });
      return false;
    },
    [makeInfoFormFields, onSubmit]
  );
  useEffect(() => {
    if (emailQueryParam && !hasBeenRedirected && isAcceptTeamInviteCheckDone) {
      setHasBeenRedirected(true);
      handleSubmit();
    }
  }, [
    handleSubmit,
    hasBeenRedirected,
    emailQueryParam,
    setHasBeenRedirected,
    isAcceptTeamInviteCheckDone,
  ]);
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
  const isEmailDisabled = isB2BFlow && !!emailQueryParam;
  return (
    <Flex
      gap={6}
      flexDirection="column"
      as="form"
      autoComplete="off"
      noValidate
      onSubmit={handleSubmit}
    >
      {isInviteLinkDisabled ? (
        <Infobox
          size="medium"
          mood="warning"
          title={translate(I18N_KEYS.DISABLED_INFOBOX_TITLE)}
          description={translate(I18N_KEYS.DISABLED_INFOBOX_DESCRIPTION)}
        />
      ) : null}
      <Heading
        as="h1"
        color={
          isInviteLinkDisabled
            ? "ds.text.oddity.disabled"
            : "ds.text.neutral.catchy"
        }
        textStyle="ds.title.section.large"
      >
        {translate(
          isInviteLinkFlow
            ? I18N_KEYS.EMPLOYEE_SIGN_UP_HEADER
            : I18N_KEYS.HEADER
        )}
      </Heading>
      {isInviteLinkFlow ? null : (
        <Paragraph>{translate(I18N_KEYS.SUBHEADER)}</Paragraph>
      )}
      <TextInput
        id="primaryEmailInput"
        type="email"
        ref={emailField}
        disabled={isEmailDisabled || isInviteLinkDisabled}
        label={
          isInviteLinkFlow
            ? translate(I18N_KEYS.EMAIL_INPUT_LABEL_COMPANY)
            : translate(I18N_KEYS.EMAIL_INPUT_LABEL_GENERIC)
        }
        placeholder={
          isInviteLinkFlow
            ? "name@example.com"
            : translate(I18N_KEYS.EMAIL_INPUT_PLACEHOLDER)
        }
        onBlur={handleLoginBlurred}
        onChange={handleLoginChanged}
        value={loginValue}
        feedback={
          loginErrorText
            ? {
                id: "error-message",
                text: loginErrorText,
                type: "error",
              }
            : undefined
        }
      />
      <Button
        sx={{ alignSelf: "end" }}
        size="large"
        mood="brand"
        intensity="catchy"
        type="submit"
        disabled={isLoading || isInviteLinkDisabled}
        data-testid="login-button"
      >
        {isLoading ? <LoadingIcon /> : translate(I18N_KEYS.NEXT_BUTTON_TEXT)}
      </Button>
    </Flex>
  );
};
