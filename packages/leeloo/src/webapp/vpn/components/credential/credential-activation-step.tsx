import { useEffect, useRef, useState } from "react";
import { PageView } from "@dashlane/hermes";
import { Button, Checkbox, Flex, Paragraph } from "@dashlane/design-system";
import { TextInput } from "@dashlane/ui-components";
import useTranslate from "../../../../libs/i18n/useTranslate";
import { logPageView } from "../../../../libs/logs/logEvent";
import { isValidEmail } from "../../../../libs/validators";
import {
  TutorialStep,
  TutorialStepOptions,
  TutorialStepStatus,
} from "../tutorial/tutorial-step";
import {
  HOTSPOTSHIELD_PRIVACY_POLICY_URL,
  HOTSPOTSHIELD_TERMS_URL,
  VPN_LEARN_MORE,
} from "../../helpers/links";
import { OPEN_IN_NEW_TAB } from "../../helpers/constants";
const I18N_KEYS = {
  ACTIVATE: {
    TEXT: "webapp_vpn_page_credential_activate_text_markup",
    BUTTON: "webapp_vpn_page_credential_activate_button",
    INVALID_EMAIL_ERROR: "webapp_vpn_page_credential_activate_email_error",
    PRIVACY_CONSENT:
      "webapp_vpn_page_credential_activate_privacy_consent_markup",
    NO_CONSENT_TOOLTIP:
      "webapp_vpn_page_credential_activate_missing_consent_tooltip",
  },
};
export interface ActivationData {
  defaultEmail: string;
  email: string;
  isPrivacyConsentChecked: boolean;
  setEmail: (email: string) => void;
  setIsPrivacyConsentChecked: (checked: boolean) => void;
}
type CredentialActivationStepProps = {
  disabled?: boolean;
  number?: number;
  onClick?: () => void;
  options?: TutorialStepOptions;
  status: TutorialStepStatus;
  title: string;
} & ActivationData;
export const CredentialActivationStep = ({
  defaultEmail,
  setEmail,
  isPrivacyConsentChecked,
  setIsPrivacyConsentChecked,
  disabled = false,
  number,
  onClick = () => {},
  options,
  status,
  title,
}: CredentialActivationStepProps) => {
  const { translate } = useTranslate();
  const emailInputRef = useRef<HTMLInputElement>();
  useEffect(() => {
    logPageView(PageView.ToolsVpnPrivacyConsent);
  }, []);
  useEffect(() => {
    if (defaultEmail) {
      emailInputRef?.current?.select();
    }
  }, [defaultEmail, emailInputRef]);
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [showMissingConsentErrorFeedback, setShowMissingConsentErrorFeedback] =
    useState(false);
  const canActivateAccount = isEmailValid && !disabled;
  const validateEmail = (value: string) => setIsEmailValid(isValidEmail(value));
  const invalidEmailError = translate(I18N_KEYS.ACTIVATE.INVALID_EMAIL_ERROR);
  const activateText = translate.markup(
    I18N_KEYS.ACTIVATE.TEXT,
    { learnMore: VPN_LEARN_MORE },
    { linkTarget: OPEN_IN_NEW_TAB }
  );
  const privacyConsent = translate.markup(
    I18N_KEYS.ACTIVATE.PRIVACY_CONSENT,
    {
      privacyPolicyLink: HOTSPOTSHIELD_PRIVACY_POLICY_URL,
      serviceTermsLink: HOTSPOTSHIELD_TERMS_URL,
    },
    { linkTarget: OPEN_IN_NEW_TAB }
  );
  const formValidate = () => {
    if (isPrivacyConsentChecked) {
      return onClick();
    }
    return setShowMissingConsentErrorFeedback(true);
  };
  const showErrorFeedback =
    showMissingConsentErrorFeedback && !isPrivacyConsentChecked;
  return (
    <TutorialStep
      options={options}
      title={title}
      number={number}
      status={status}
      actions={
        <Button
          type="button"
          onClick={formValidate}
          disabled={!canActivateAccount}
        >
          {translate(I18N_KEYS.ACTIVATE.BUTTON)}
        </Button>
      }
    >
      <Flex flexDirection="column">
        <Paragraph textStyle="ds.body.reduced.regular">
          {activateText}
        </Paragraph>

        <TextInput
          sx={{ marginTop: "16px", maxWidth: "480px" }}
          defaultValue={defaultEmail}
          onChange={(event) => setEmail(event.currentTarget.value)}
          onBlur={(event) => validateEmail(event.target.value)}
          onFocus={(event) => event.target.select()}
          feedbackText={isEmailValid ? undefined : invalidEmailError}
          feedbackType={isEmailValid ? undefined : "error"}
          type="email"
          disabled={disabled}
          autoFocus
          fullWidth
          ref={emailInputRef}
        />

        <div sx={{ marginTop: "36px", width: "100%", height: "40px" }}>
          <Checkbox
            disabled={disabled}
            label={privacyConsent}
            checked={isPrivacyConsentChecked}
            onChange={(event) =>
              setIsPrivacyConsentChecked(event.currentTarget.checked)
            }
            feedback={
              showErrorFeedback
                ? {
                    id: translate(I18N_KEYS.ACTIVATE.NO_CONSENT_TOOLTIP),
                    text: translate(I18N_KEYS.ACTIVATE.NO_CONSENT_TOOLTIP),
                    type: "error",
                  }
                : undefined
            }
          />
        </div>
      </Flex>
    </TutorialStep>
  );
};
