import { Heading } from "@dashlane/ui-components";
import useTranslate from "../../../../../../libs/i18n/useTranslate";
import { AccountSubPanel } from "../../../../account-subpanel/account-subpanel";
import { SettingsSection } from "../../../security-settings-root/settings-section/settings-section";
import { AdminAssistedRecoveryHelpParagraph } from "../../sections/admin-assisted-recovery-help-section/admin-assisted-recovery-help-paragraph";
import styles from "./admin-assisted-recovery-help-section.css";
export interface Props {
  onNavigateOut: () => void;
}
const I18N_KEYS = {
  SUB_PANEL_HEADING:
    "webapp_account_security_settings_account_recovery_setting_title",
  TITLE: "webapp_account_security_settings_account_recovery_help_title",
  INTRO: "webapp_account_security_settings_account_recovery_help_intro",
  SUBTITLE: "webapp_account_security_settings_account_recovery_help_subtitle",
  CONTENT: "webapp_account_security_settings_account_recovery_help_content",
  SECTION_ONE_HEADER:
    "webapp_account_security_settings_account_recovery_help_section_one_header",
  SECTION_ONE_CONTENT:
    "webapp_account_security_settings_account_recovery_help_section_one_content",
  SECTION_TWO_HEADER:
    "webapp_account_security_settings_account_recovery_help_section_two_header",
  SECTION_TWO_CONTENT:
    "webapp_account_security_settings_account_recovery_help_section_two_content",
  SECTION_THREE_HEADER:
    "webapp_account_security_settings_account_recovery_help_section_three_header",
  SECTION_THREE_CONTENT:
    "webapp_account_security_settings_account_recovery_help_section_three_content",
  SECTION_FOUR_HEADER:
    "webapp_account_security_settings_account_recovery_help_section_four_header",
  SECTION_FOUR_CONTENT:
    "webapp_account_security_settings_account_recovery_help_section_four_content",
};
export const AdminRecoveryHelpSection = ({ onNavigateOut }: Props) => {
  const { translate } = useTranslate();
  return (
    <AccountSubPanel
      headingText={translate(I18N_KEYS.SUB_PANEL_HEADING)}
      onNavigateOut={onNavigateOut}
    >
      <SettingsSection sectionTitle={translate(I18N_KEYS.TITLE)}>
        <p className={styles.intro}>{translate(I18N_KEYS.INTRO)}</p>
        <div>
          <Heading size="x-small" as="h2">
            {translate(I18N_KEYS.SUBTITLE)}
          </Heading>
          <p>{translate(I18N_KEYS.CONTENT)}</p>

          <AdminAssistedRecoveryHelpParagraph
            number={1}
            header={translate(I18N_KEYS.SECTION_ONE_HEADER)}
            content={translate(I18N_KEYS.SECTION_ONE_CONTENT)}
          />

          <AdminAssistedRecoveryHelpParagraph
            number={2}
            header={translate(I18N_KEYS.SECTION_TWO_HEADER)}
            content={translate(I18N_KEYS.SECTION_TWO_CONTENT)}
          />

          <AdminAssistedRecoveryHelpParagraph
            number={3}
            header={translate(I18N_KEYS.SECTION_THREE_HEADER)}
            content={translate(I18N_KEYS.SECTION_THREE_CONTENT)}
          />

          <AdminAssistedRecoveryHelpParagraph
            number={4}
            header={translate(I18N_KEYS.SECTION_FOUR_HEADER)}
            content={translate(I18N_KEYS.SECTION_FOUR_CONTENT)}
          />
        </div>
      </SettingsSection>
    </AccountSubPanel>
  );
};
