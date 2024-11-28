import * as React from "react";
import { AuthenticationCode } from "@dashlane/communication";
import FormWrapper from "../FormWrapper";
import { FormActionsProps } from "../FormWrapper/FormActions";
import FormInput from "../../../components/inputs/login/FormInput";
import useTranslate from "../../../libs/i18n/useTranslate";
import InputWithMessage, {
  MessageType,
} from "../../../components/inputs/login/InputWithMessageWrapper";
import { ThemeEnum } from "../../../libs/helpers-types";
import { DashlaneUpdateNeeded } from "../errors/dashlaneUpdateNeeded";
const I18N_KEYS = {
  CONFIRM: "login/email_confirm_button",
  CREATE_AN_ACCOUNT: "login/email_create_an_account_button",
  EMAIL_PLACEHOLDER: "login/email_placeholder",
  ENTER_YOUR_EMAIL: "login/email_label",
};
const I18N_ERROR_KEYS = {
  INVALID_LOGIN: "login/security_code_error_invalid_email",
  NETWORK_ERROR: "login/security_code_error_network_error",
  SSO_BLOCKED: "login/security_code_error_sso_blocked",
  TEAM_GENERIC_ERROR: "login/security_code_error_team_generic_error",
  UNKNOWN_ERROR: "login/security_code_error_unkown",
  USER_DOESNT_EXIST: "login/security_code_error_unknown_email",
  USER_DOESNT_EXIST_UNLIKELY_MX: "login/security_code_error_unknown_email",
  USER_DOESNT_EXIST_INVALID_MX: "login/security_code_error_unknown_email",
};
export interface EmailStepProps {
  isLoading: boolean;
  onCreateAnAccountClick: () => void;
  onSubmitEmail: (email: string) => void;
  setWaitingForResponseState: () => void;
  resetErrorState: () => void;
  error?: string;
}
const EmailStep: React.FunctionComponent<EmailStepProps> = (
  props: EmailStepProps
) => {
  const { translate } = useTranslate();
  const showDashlaneUpdateInfoBox = (error: string | undefined) =>
    error ===
    AuthenticationCode[
      AuthenticationCode.CLIENT_VERSION_DOES_NOT_SUPPORT_SSO_MIGRATION
    ];
  const getErrorDesc = (error: string): string | undefined => {
    if (showDashlaneUpdateInfoBox(error)) {
      return;
    }
    return translate(
      error in I18N_ERROR_KEYS
        ? I18N_ERROR_KEYS[error as keyof typeof I18N_ERROR_KEYS]
        : I18N_ERROR_KEYS.UNKNOWN_ERROR
    );
  };
  const [emailValue, setEmailValue] = React.useState("");
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    e.preventDefault();
    setEmailValue(e.target.value);
    props.resetErrorState();
  };
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    props.onSubmitEmail(emailValue);
    props.setWaitingForResponseState();
  };
  const formActionsProps: FormActionsProps = {
    isLoading: props.isLoading,
    primaryButtonText: translate(I18N_KEYS.CONFIRM),
    secondaryButtonText: translate(I18N_KEYS.CREATE_AN_ACCOUNT),
    onSecondaryButtonClick: props.onCreateAnAccountClick,
    primaryButtonIsDisabled: !emailValue,
  };
  const labelId = "email";
  return (
    <FormWrapper
      title={{ text: translate(I18N_KEYS.ENTER_YOUR_EMAIL), labelId }}
      handleSubmit={onSubmit}
      formActionsProps={formActionsProps}
    >
      <InputWithMessage
        type={MessageType.Error}
        message={props.error && getErrorDesc(props.error)}
        theme={ThemeEnum.Dark}
      >
        <FormInput
          value={emailValue}
          hasError={!!props.error}
          placeholder={translate(I18N_KEYS.EMAIL_PLACEHOLDER)}
          inputType="email"
          handleChange={handleInputChange}
          ariaLabelledBy={labelId}
          theme={ThemeEnum.Dark}
        />
      </InputWithMessage>
      {showDashlaneUpdateInfoBox(props.error) ? <DashlaneUpdateNeeded /> : null}
    </FormWrapper>
  );
};
export default React.memo(EmailStep);
