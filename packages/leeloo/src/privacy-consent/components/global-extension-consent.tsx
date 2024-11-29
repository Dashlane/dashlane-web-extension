import { ChangeEvent, useState } from "react";
import { managementUninstallSelf } from "@dashlane/webextensions-apis";
import {
  Button,
  Checkbox,
  ExpressiveIcon,
  Flex,
  Paragraph,
} from "@dashlane/design-system";
import {
  ExtensionSettings,
  RequiredExtensionSettings,
} from "@dashlane/communication";
import useTranslate from "../../libs/i18n/useTranslate";
import { StepCard } from "../../account-creation/admin-trial-account-creation/step-card/step-card";
const I18N_KEYS = {
  TITLE: "account_creation_user_consent_title",
  DISCLAIMER: "account_creation_user_consent_disclaimer_markup",
  AGREE_BUTTON: "account_creation_user_consent_agree",
  DECLINE_BUTTON: "account_creation_user_consent_decline",
  MANDATORY_CHECKBOX_DESCRIPTION:
    "account_creation_user_consent_mandatory_checkbox",
  MANDATORY_DESCRIPTION: "account_creation_user_consent_mandatory_description",
  CREATE_ACCOUNT: "account_creation_user_consent_create_account",
  AUTOFILL: "account_creation_user_consent_autofill",
  OPTIONAL_CHECKBOX_DESCRIPTION:
    "account_creation_user_consent_optional_checkbox",
  OPTIONAL_DESCRIPTION: "account_creation_user_consent_optional_description",
  TRACKING: "account_creation_user_consent_tracking",
  IMPROVE: "account_creation_user_consent_improve",
};
const SX_STYLE = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
};
interface GlobalExtensionConsentProps {
  handleConsentSet: (consents: RequiredExtensionSettings) => Promise<void>;
}
export const GlobalExtensionConsent = ({
  handleConsentSet,
}: GlobalExtensionConsentProps) => {
  const [consentSettings, setConsentSettings] =
    useState<RequiredExtensionSettings>({
      interactionDataConsent: true,
      personalDataConsent: true,
    });
  const { translate } = useTranslate();
  const setConsentField = (
    consentField: keyof ExtensionSettings,
    consentValue: ExtensionSettings[keyof ExtensionSettings]
  ) => {
    setConsentSettings((currentConsent) => ({
      ...currentConsent,
      [consentField]: consentValue,
    }));
  };
  const agreeConsent = async () => {
    await handleConsentSet(consentSettings);
  };
  const declineConsentAndUninstall = async () => {
    await managementUninstallSelf();
  };
  return (
    <StepCard title={translate(I18N_KEYS.TITLE)}>
      <Checkbox
        readOnly
        checked
        label={translate(I18N_KEYS.MANDATORY_CHECKBOX_DESCRIPTION)}
      />

      <Flex
        flexDirection="column"
        gap="8px"
        sx={{
          backgroundColor: "ds.container.agnostic.neutral.quiet",
          padding: "8px",
        }}
      >
        <Paragraph>{translate(I18N_KEYS.MANDATORY_DESCRIPTION)}</Paragraph>

        <Paragraph sx={SX_STYLE}>
          <ExpressiveIcon name="LockOutlined" size="medium" />
          {translate(I18N_KEYS.CREATE_ACCOUNT)}
        </Paragraph>
        <Paragraph sx={SX_STYLE}>
          <ExpressiveIcon name="FeatureAutofillOutlined" size="medium" />
          {translate(I18N_KEYS.AUTOFILL)}
        </Paragraph>
      </Flex>

      <Checkbox
        checked={consentSettings.interactionDataConsent}
        label={translate(I18N_KEYS.OPTIONAL_CHECKBOX_DESCRIPTION)}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          setConsentField("interactionDataConsent", e.currentTarget.checked)
        }
      />

      <Flex
        flexDirection="column"
        gap="8px"
        sx={{
          backgroundColor: "ds.container.agnostic.neutral.quiet",
          padding: "8px",
        }}
      >
        <Paragraph>{translate(I18N_KEYS.OPTIONAL_DESCRIPTION)}</Paragraph>

        <Paragraph sx={SX_STYLE}>
          <ExpressiveIcon name="DashboardOutlined" size="medium" />
          {translate(I18N_KEYS.TRACKING)}
        </Paragraph>
        <Paragraph sx={SX_STYLE}>
          <ExpressiveIcon name="TipOutlined" size="medium" />
          {translate(I18N_KEYS.IMPROVE)}
        </Paragraph>
      </Flex>

      <Paragraph
        textStyle="ds.body.reduced.regular"
        sx={{ marginBottom: "24px" }}
      >
        {translate.markup(I18N_KEYS.DISCLAIMER, {}, { linkTarget: "_blank" })}
      </Paragraph>

      <Flex gap="12px" justifyContent="flex-end">
        <Button
          mood="neutral"
          intensity="supershy"
          size="large"
          onClick={declineConsentAndUninstall}
        >
          {translate(I18N_KEYS.DECLINE_BUTTON)}
        </Button>

        <Button intensity="catchy" size="large" onClick={agreeConsent}>
          {translate(I18N_KEYS.AGREE_BUTTON)}
        </Button>
      </Flex>
    </StepCard>
  );
};
