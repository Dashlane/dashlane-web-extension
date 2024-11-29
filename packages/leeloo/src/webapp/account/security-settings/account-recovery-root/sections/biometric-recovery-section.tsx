import { Badge } from "@dashlane/design-system";
import useTranslate from "../../../../../libs/i18n/useTranslate";
import { SettingsSection } from "../../security-settings-root/settings-section/settings-section";
const I18N_KEYS = {
  BIOMETRIC_RECOVERY_TITLE:
    "webapp_account_security_settings_account_recovery_section_biometric_recovery_title",
  BIOMETRIC_RECOVERY_DESCRIPTION:
    "webapp_account_security_settings_account_recovery_section_biometric_recovery_description",
  MOBILE_ONLY_BADGE: "_common_settings_mobile_only_feature_badge",
};
export const BiometricRecoverySection = () => {
  const { translate } = useTranslate();
  return (
    <SettingsSection
      sectionTitle={translate(I18N_KEYS.BIOMETRIC_RECOVERY_TITLE)}
    >
      <div sx={{ fontSize: "12px" }}>
        <Badge label={translate(I18N_KEYS.MOBILE_ONLY_BADGE)} />
        <label style={{ display: "block", marginTop: "16px" }}>
          {translate(I18N_KEYS.BIOMETRIC_RECOVERY_DESCRIPTION)}
        </label>
      </div>
    </SettingsSection>
  );
};
