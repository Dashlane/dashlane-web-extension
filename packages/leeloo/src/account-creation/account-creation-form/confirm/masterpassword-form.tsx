import { useEffect, useState } from "react";
import { Maybe } from "tsmonad";
import {
  Button,
  Checkbox,
  Flex,
  Heading,
  Icon,
  Paragraph,
  PasswordField,
} from "@dashlane/design-system";
import { PageView, SignupFlowStep } from "@dashlane/hermes";
import { carbonConnector } from "../../../libs/carbon/connector";
import { logPageView } from "../../../libs/logs/logEvent";
import { useLocation } from "../../../libs/router";
import useTranslate from "../../../libs/i18n/useTranslate";
import { usePasswordStrength } from "../../../libs/password-evaluation/usePasswordStrength";
import { AccountCreationStep } from "../../types";
import { PasswordStrengthTooltip } from "../password-strength-tooltip/password-strength-tooltip";
import { logUserSignupToDashlaneEvent } from "../logs";
import { getSignUpUrlQueryParameters } from "../../helpers";
const I18N_KEYS = {
  PASSWORD_ERROR: "standalone_account_creation_error_",
  TIPS_AND_OFFERS_LABEL:
    "webapp_auth_panel_standalone_account_creation_tips_and_offers_label",
  SUBSCRIPTION_LABEL:
    "webapp_auth_panel_standalone_account_creation_subscription_label",
  HIDE_PASSWORD_LABEL:
    "webapp_auth_panel_standalone_account_creation_password_hide_label",
  SHOW_PASSWORD_LABEL:
    "webapp_auth_panel_standalone_account_creation_password_show_label",
  PASSWORD_LABEL:
    "webapp_auth_panel_standalone_account_creation_password_label",
  EMAIL_LABEL: "webapp_auth_panel_standalone_account_creation_email_label",
  PASSWORD_PLACEHOLDER:
    "webapp_auth_panel_standalone_account_creation_password_placeholder",
  CONFIRM_PASSWORD_LABEL:
    "webapp_auth_panel_standalone_account_creation_confirm_password_label",
  CONFIRM_PASSWORD_PLACEHOLDER:
    "webapp_auth_panel_standalone_account_creation_confirm_password_placeholder",
  CONFIRM_BUTTON_LABEL:
    "webapp_auth_panel_standalone_account_creation_step2_confirm_button",
  CONFIRM_BUTTON_LABEL_TAC: "team_account_creation_button_text_submit",
  BACK_LABEL: "webapp_auth_panel_standalone_account_creation_back_label",
  TERMS_OF_SERVICE: "webapp_auth_panel_standalone_account_creation_tos_markup",
  PASSWORD_STRENGTH: {
    0: "webapp_auth_panel_standalone_account_creation_zxcvbn_weakest_password",
    1: "webapp_auth_panel_standalone_account_creation_zxcvbn_weak_password",
    2: "webapp_auth_panel_standalone_account_creation_zxcvbn_acceptable_password",
    3: "webapp_auth_panel_standalone_account_creation_zxcvbn_good_password",
    4: "webapp_auth_panel_standalone_account_creation_zxcvbn_awesome_password",
  },
  HEADER: "webapp_auth_panel_standalone_account_creation_step2_header",
  SUBHEADER: "webapp_auth_panel_standalone_account_creation_step2_sub_header",
};
export interface ConfirmSubmitOptions {
  password: string;
  emailsTipsAndOffers: Maybe<boolean>;
  privacyPolicyAndToS: Maybe<boolean>;
  isEu: boolean;
}
interface Props {
  backStep?: (step: AccountCreationStep) => void;
  onSubmit: (options: ConfirmSubmitOptions) => void;
  isEu: boolean | null;
  isAdminSignUp: boolean;
  isEmployeeSignUp: boolean;
  login: string;
  withNewFlow?: boolean;
}
export const MasterPasswordForm = ({
  backStep,
  onSubmit,
  isEu,
  isAdminSignUp,
  login,
  isEmployeeSignUp,
  withNewFlow = false,
}: Props) => {
  const { translate } = useTranslate();
  const { search } = useLocation();
  const { prefilledTeamKey, isFromMassDeployment } =
    getSignUpUrlQueryParameters(search);
  const [isEmailsTipsAndOffersChecked, setIsEmailsTipsAndOffersChecked] =
    useState<Maybe<boolean>>(Maybe.nothing());
  const [isTosAccepted, setIsTosAccepted] = useState<Maybe<boolean>>(
    Maybe.nothing()
  );
  const [createPasswordValue, setCreatePasswordValue] = useState("");
  const [createPasswordErrorType, setCreatePasswordErrorType] = useState<
    string | null
  >(null);
  const [confirmPasswordValue, setConfirmPasswordValue] = useState("");
  const [confirmPasswordErrorType, setConfirmPasswordErrorType] = useState<
    string | null
  >(null);
  const {
    passwordStrength,
    resetPasswordStrength,
    setPasswordStrength,
    isPasswordStrengthScore,
    isPasswordStrongEnough,
  } = usePasswordStrength();
  const [isLoading, setIsLoading] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const handleEmailsTipsAndOffersChanged = (isChecked: boolean) => {
    setIsEmailsTipsAndOffersChecked(Maybe.maybe(isChecked));
  };
  useEffect(() => {
    if (isEmployeeSignUp) {
      logPageView(PageView.JoinDashlaneTeamCreateMasterPassword);
      logUserSignupToDashlaneEvent(
        SignupFlowStep.CreateMasterPassword,
        prefilledTeamKey,
        isFromMassDeployment
      );
    }
  }, [isEmployeeSignUp, isFromMassDeployment, prefilledTeamKey]);
  useEffect(() => {
    handleEmailsTipsAndOffersChanged(!isEu);
  }, [isEu]);
  const _getPasswordErrorText = (passwordErrorType: string | null) => {
    if (!passwordErrorType) {
      return null;
    }
    return translate(`${I18N_KEYS.PASSWORD_ERROR}${passwordErrorType}`);
  };
  const handleCreatePasswordBlurred = () => {
    setShowTooltip(false);
    if (
      createPasswordValue &&
      confirmPasswordValue &&
      createPasswordValue !== confirmPasswordValue
    ) {
      setConfirmPasswordErrorType("passwords_dont_match");
    }
  };
  const handleCreatePasswordFocused = () => {
    setShowTooltip(true);
  };
  const handleCreatePasswordChanged = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const password = event.target.value;
    setCreatePasswordValue(password);
    if (createPasswordErrorType) {
      setCreatePasswordErrorType(null);
    }
    if (confirmPasswordErrorType) {
      setConfirmPasswordErrorType(null);
    }
    if (password === "") {
      resetPasswordStrength();
    }
    if (password !== "") {
      const currentPasswordStrength = await carbonConnector.evaluatePassword({
        password,
      });
      setPasswordStrength(currentPasswordStrength);
    }
  };
  const handleConfirmPasswordChanged = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setConfirmPasswordErrorType(null);
    setConfirmPasswordValue(event.target.value);
  };
  const handleConfirmPasswordBlurred = () => {
    if (confirmPasswordValue && confirmPasswordValue !== createPasswordValue) {
      setConfirmPasswordErrorType("passwords_dont_match");
    }
  };
  const handleBackButtonClicked = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    if (!isLoading) {
      backStep?.(AccountCreationStep.EnterAccountEmail);
    }
  };
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): boolean => {
    event.preventDefault();
    if (!isPasswordStrongEnough) {
      setCreatePasswordErrorType("weak_password");
    } else if (confirmPasswordValue !== createPasswordValue) {
      setConfirmPasswordErrorType("passwords_dont_match");
    } else {
      setIsLoading(true);
      const submitOptions: ConfirmSubmitOptions = {
        emailsTipsAndOffers: isEmailsTipsAndOffersChecked,
        password: createPasswordValue,
        privacyPolicyAndToS: isTosAccepted,
        isEu: !!isEu,
      };
      onSubmit(submitOptions);
    }
    return false;
  };
  const handlePrivacyPolicyAndToSChanged = (isChecked: boolean) => {
    setIsTosAccepted(Maybe.maybe(isChecked));
  };
  const emailsTipsAndOffersLabel = translate(
    isEu ? I18N_KEYS.TIPS_AND_OFFERS_LABEL : I18N_KEYS.SUBSCRIPTION_LABEL
  );
  const createPasswordErrorText = _getPasswordErrorText(
    createPasswordErrorType
  );
  const confirmPasswordErrorText = _getPasswordErrorText(
    confirmPasswordErrorType
  );
  const isSubmitDisabled = () => {
    if (!isTosAccepted.valueOr(!isEu)) {
      return true;
    }
    const isEmptyPasswords = !createPasswordValue || !confirmPasswordValue;
    const isSamePassword = confirmPasswordValue === createPasswordValue;
    const errorsPresent =
      Boolean(createPasswordErrorText) || Boolean(confirmPasswordErrorText);
    return (
      isEmptyPasswords ||
      !isSamePassword ||
      !isPasswordStrongEnough ||
      errorsPresent
    );
  };
  return (
    <>
      {!withNewFlow ? (
        <>
          <Heading
            as="h1"
            color="ds.text.neutral.catchy"
            textStyle="ds.title.section.large"
          >
            {translate(I18N_KEYS.HEADER)}
          </Heading>
          <Paragraph>{translate(I18N_KEYS.SUBHEADER)}</Paragraph>
          <Paragraph
            data-testid="signup-email-header"
            sx={{ marginBottom: "24px" }}
            textStyle="ds.body.standard.strong"
            color="ds.text.neutral.catchy"
          >
            {login}
          </Paragraph>
        </>
      ) : null}
      <form autoComplete="off" noValidate={true} onSubmit={handleSubmit}>
        <Flex flexDirection="column" gap={4}>
          <PasswordStrengthTooltip
            showTooltip={showTooltip}
            passwordStrength={passwordStrength}
            id="password-tooltip"
          >
            <>
              <PasswordField
                id="primaryPasswordInput"
                aria-describedby="password-tooltip"
                label={translate(I18N_KEYS.PASSWORD_LABEL)}
                onBlur={handleCreatePasswordBlurred}
                onChange={handleCreatePasswordChanged}
                onFocus={handleCreatePasswordFocused}
                placeholder={translate(I18N_KEYS.PASSWORD_PLACEHOLDER)}
                value={createPasswordValue}
                toggleVisibilityLabel={{
                  show: translate(I18N_KEYS.SHOW_PASSWORD_LABEL),
                  hide: translate(I18N_KEYS.HIDE_PASSWORD_LABEL),
                }}
                passwordStrength={
                  passwordStrength &&
                  isPasswordStrengthScore(passwordStrength.score)
                    ? {
                        score: passwordStrength.score,
                        descriptionId: "primaryPasswordInput",
                        description: translate(
                          `${
                            I18N_KEYS.PASSWORD_STRENGTH[passwordStrength.score]
                          }`
                        ),
                      }
                    : undefined
                }
              />
            </>
          </PasswordStrengthTooltip>

          <PasswordField
            id="secondaryPasswordInput"
            label={translate(I18N_KEYS.CONFIRM_PASSWORD_LABEL)}
            onBlur={() => setTimeout(handleConfirmPasswordBlurred, 150)}
            onChange={handleConfirmPasswordChanged}
            placeholder={translate(I18N_KEYS.CONFIRM_PASSWORD_PLACEHOLDER)}
            value={confirmPasswordValue}
            toggleVisibilityLabel={{
              show: translate(I18N_KEYS.SHOW_PASSWORD_LABEL),
              hide: translate(I18N_KEYS.HIDE_PASSWORD_LABEL),
            }}
            error={!!confirmPasswordErrorType}
            feedback={
              confirmPasswordErrorType
                ? {
                    text: translate(
                      `${I18N_KEYS.PASSWORD_ERROR}${confirmPasswordErrorType}`
                    ),
                  }
                : undefined
            }
          />

          <Checkbox
            name="emailsTipsAndOffers"
            onChange={(e) => handleEmailsTipsAndOffersChanged(e.target.checked)}
            checked={isEmailsTipsAndOffersChecked.valueOr(!isEu)}
            label={emailsTipsAndOffersLabel}
            sx={{
              fontSize: "14px",
            }}
          />

          <Checkbox
            name="privacyPolicyAndToS"
            onChange={(e) => handlePrivacyPolicyAndToSChanged(e.target.checked)}
            checked={isTosAccepted.valueOr(!isEu)}
            label={translate.markup(
              I18N_KEYS.TERMS_OF_SERVICE,
              {},
              {
                linkTarget: "_blank",
              }
            )}
            sx={{
              fontSize: "14px",
            }}
          />

          <Flex sx={{ marginTop: "24px" }} justifyContent="space-between">
            {backStep ? (
              <Button
                mood="brand"
                intensity="supershy"
                size="large"
                disabled={isLoading}
                sx={{
                  alignSelf: "start",
                }}
                layout="iconLeading"
                icon={<Icon name="ArrowLeftOutlined" />}
                onClick={handleBackButtonClicked}
              >
                {translate(I18N_KEYS.BACK_LABEL)}
              </Button>
            ) : null}
            <Flex
              flexDirection="column"
              alignItems="end"
              gap={4}
              sx={withNewFlow ? { width: "100%" } : {}}
            >
              <Button
                type="submit"
                mood="brand"
                intensity="catchy"
                size="large"
                isLoading={isLoading}
                disabled={isSubmitDisabled()}
                fullsize={withNewFlow}
              >
                {translate(
                  isAdminSignUp
                    ? withNewFlow
                      ? I18N_KEYS.CONFIRM_BUTTON_LABEL
                      : I18N_KEYS.CONFIRM_BUTTON_LABEL_TAC
                    : I18N_KEYS.CONFIRM_BUTTON_LABEL
                )}
              </Button>
            </Flex>
          </Flex>
        </Flex>
      </form>
    </>
  );
};
