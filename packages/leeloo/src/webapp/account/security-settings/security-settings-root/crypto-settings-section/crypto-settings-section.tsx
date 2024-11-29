import React, { useEffect, useState } from "react";
import { DataStatus } from "@dashlane/framework-react";
import { SupportedDerivationMethods } from "@dashlane/communication";
import { Paragraph, SelectField, SelectOption } from "@dashlane/design-system";
import { FEATURE_FLIPS_WITHOUT_MODULE } from "@dashlane/framework-dashlane-application";
import { carbonConnector } from "../../../../../libs/carbon/connector";
import { useHasFeatureEnabled } from "../../../../../libs/carbon/hooks/useHasFeature";
import useTranslate from "../../../../../libs/i18n/useTranslate";
import { SettingsSection } from "../settings-section/settings-section";
import { useCanUserChangeCrypto } from "./hooks/useCanUserChangeCrypto";
import { useUserDerivationMethod } from "./hooks/useUserDerivationMethod";
import { useIsMPlessUser } from "../../hooks/use-is-mpless-user";
const I18N_KEYS = {
  HELP_TEXT: "webapp_account_security_settings_help_text_markup",
  HELP_TEXT_ENFORCED_KDF:
    "webapp_account_security_settings_help_text_enforced_kdf_markup",
  HELP_TEXT_PASSWORD_LESS:
    "webapp_account_security_settings_help_text_password_less",
  INPUT_PLACEHOLDER: "webapp_account_security_settings_input_placeholder",
  INPUT_ARGON: "webapp_account_security_settings_input_value_argon",
  INPUT_PBKDF2_ADVANCED:
    "webapp_account_security_settings_input_value_pbkdf2_advanced",
  INPUT_PBKDF2_STANDARD:
    "webapp_account_security_settings_input_value_pbkdf2_standard",
  SUB_TITLE: "webapp_account_security_settings_sub_title",
  GENERIC_ERROR_MESSAGE: "_common_generic_error",
};
const CRYPTO_SELECT_LABEL = "cryptoSelectLabel";
interface Option {
  label: string;
  value: SupportedDerivationMethods;
  disabled?: boolean;
}
export const CryptoSettingsSection = () => {
  const { translate } = useTranslate();
  const { status: isMPLessUserStatus, isMPLessUser } = useIsMPlessUser();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);
  const [currentDerivation, setCurrentDerivation] = useState<
    SupportedDerivationMethods | ""
  >("");
  const isFFActivated = useHasFeatureEnabled(
    FEATURE_FLIPS_WITHOUT_MODULE.ItadminSAEXCryptoMigrationPhase3V1
  );
  const isDerivationMethodSelectable =
    useCanUserChangeCrypto() && isFFActivated;
  const derivationMethodStored = useUserDerivationMethod();
  useEffect(() => {
    if (derivationMethodStored) {
      setIsLoading(false);
      setCurrentDerivation(derivationMethodStored);
    }
  }, [derivationMethodStored]);
  const cryptoOptions: Option[] = [
    {
      label: translate(I18N_KEYS.INPUT_ARGON),
      value: SupportedDerivationMethods.ARGON2D,
    },
    {
      label: translate(I18N_KEYS.INPUT_PBKDF2_ADVANCED),
      value: SupportedDerivationMethods.PBKDF2,
    },
    {
      label: translate(I18N_KEYS.INPUT_PBKDF2_STANDARD),
      value: SupportedDerivationMethods.KWC3,
      disabled: true,
    },
  ];
  const getDerivationLabel = (kdf: SupportedDerivationMethods | ""): string =>
    cryptoOptions.find((option) => option.value === kdf)?.label ?? "";
  const onCryptoSelectChange = async (
    newDerivationMethod: SupportedDerivationMethods
  ) => {
    setIsLoading(true);
    setHasError(false);
    setCurrentDerivation(newDerivationMethod);
    try {
      const result = await carbonConnector.changeUserCrypto({
        newDerivationMethod,
      });
      if (!result.success) {
        setHasError(true);
      }
    } catch (error) {
      setHasError(true);
      if (derivationMethodStored) {
        setCurrentDerivation(derivationMethodStored);
      }
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <SettingsSection sectionTitle={translate(I18N_KEYS.SUB_TITLE)}>
      <SelectField
        label={translate(I18N_KEYS.SUB_TITLE)}
        value={currentDerivation}
        onChange={onCryptoSelectChange}
        disabled={
          !isDerivationMethodSelectable ||
          isLoading ||
          (isMPLessUserStatus === DataStatus.Success && isMPLessUser)
        }
        placeholder={
          isDerivationMethodSelectable
            ? translate(I18N_KEYS.INPUT_PLACEHOLDER)
            : getDerivationLabel(currentDerivation)
        }
        error={hasError}
        feedback={
          hasError
            ? { text: translate(I18N_KEYS.GENERIC_ERROR_MESSAGE) }
            : undefined
        }
        aria-describedby={CRYPTO_SELECT_LABEL}
      >
        {cryptoOptions.map((option) => (
          <SelectOption
            key={option.value}
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </SelectOption>
        ))}
      </SelectField>

      <Paragraph
        textStyle="ds.body.helper.regular"
        color="ds.text.neutral.quiet"
        sx={{ marginTop: "16px" }}
        id={CRYPTO_SELECT_LABEL}
      >
        {isMPLessUserStatus !== DataStatus.Success
          ? null
          : isMPLessUser
          ? translate(I18N_KEYS.HELP_TEXT_PASSWORD_LESS)
          : isDerivationMethodSelectable
          ? translate.markup(I18N_KEYS.HELP_TEXT)
          : translate.markup(I18N_KEYS.HELP_TEXT_ENFORCED_KDF, {
              enforcedKdf: getDerivationLabel(currentDerivation),
            })}
      </Paragraph>
    </SettingsSection>
  );
};
