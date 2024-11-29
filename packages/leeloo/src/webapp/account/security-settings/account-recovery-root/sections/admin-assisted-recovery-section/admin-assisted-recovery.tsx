import React from "react";
import { DataStatus } from "@dashlane/carbon-api-consumers";
import { Badge, Toggle } from "@dashlane/design-system";
import { colors, ForwardIcon, Link } from "@dashlane/ui-components";
import { carbonConnector } from "../../../../../../libs/carbon/connector";
import useTranslate from "../../../../../../libs/i18n/useTranslate";
import { SettingsSection } from "../../../security-settings-root/settings-section/settings-section";
import styles from "./admin-assisted-recovery.css";
import { useAdminRecoveryOptInSetting } from "../../hooks/use-admin-recovery-optin-setting";
const I18N_KEYS = {
  ACCOUNT_RECOVERY_TITLE:
    "webapp_account_security_settings_account_recovery_setting_title",
  ACCOUNT_RECOVERY_DESC:
    "webapp_account_security_settings_account_recovery_setting_desc",
  ACCOUNT_RECOVERY_TITLE_TOGGLE_ARIA_LABEL:
    "webapp_account_security_settings_account_recovery_setting_toggle_aria_label",
  HELP_LINK:
    "webapp_account_security_settings_account_recovery_setting_help_link",
  WEB_ONLY_BADGE: "_common_settings_web_only_feature_badge",
};
interface Props {
  showAdminRecoveryHelp: () => void;
}
export const AdminAssistedRecoverySection = ({
  showAdminRecoveryHelp,
}: Props) => {
  const { translate } = useTranslate();
  const adminRecoveryOptInSetting = useAdminRecoveryOptInSetting();
  const [isAdminRecoveryOptIn, setIsAdminRecoveryOptIn] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  React.useEffect(() => {
    const isRecoveryOptIn =
      adminRecoveryOptInSetting.status === DataStatus.Success &&
      adminRecoveryOptInSetting.data;
    setLoading(adminRecoveryOptInSetting.status === DataStatus.Loading);
    setIsAdminRecoveryOptIn(isRecoveryOptIn);
  }, [adminRecoveryOptInSetting]);
  const onAdminRecoveryChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const isChecked = event.currentTarget.checked;
    setIsAdminRecoveryOptIn(isChecked);
    setLoading(true);
    if (isChecked) {
      await carbonConnector.activateAccountRecovery();
    } else {
      await carbonConnector.deactivateAccountRecovery();
    }
    setLoading(false);
  };
  const handleOnClickHelp = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    showAdminRecoveryHelp();
  };
  return (
    <SettingsSection
      sectionTitle={translate(I18N_KEYS.ACCOUNT_RECOVERY_TITLE)}
      action={
        <Toggle
          disabled={loading}
          id="account-recovery-optin"
          checked={isAdminRecoveryOptIn}
          onChange={onAdminRecoveryChange}
          aria-label={translate(
            I18N_KEYS.ACCOUNT_RECOVERY_TITLE_TOGGLE_ARIA_LABEL
          )}
        />
      }
    >
      <div className={styles.accountRecoverySection}>
        <Badge label={translate(I18N_KEYS.WEB_ONLY_BADGE)} />
        <label
          htmlFor="account-recovery-optin"
          className={styles.accountRecoverySectionLabel}
        >
          {translate(I18N_KEYS.ACCOUNT_RECOVERY_DESC)}
        </label>

        <Link
          href="#"
          role="button"
          color={colors.midGreen00}
          className={styles.linkButton}
          onClick={handleOnClickHelp}
        >
          <span className={styles.linkButtonContent}>
            {translate(I18N_KEYS.HELP_LINK)}
          </span>
          <span aria-hidden="true">
            <ForwardIcon size={12} color={colors.midGreen00} />
          </span>
        </Link>
      </div>
    </SettingsSection>
  );
};
