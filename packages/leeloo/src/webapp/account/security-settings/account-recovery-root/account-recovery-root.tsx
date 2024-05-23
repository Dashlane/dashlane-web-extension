import React, { useState } from 'react';
import { Link } from '@dashlane/ui-components';
import { Icon } from '@dashlane/design-system';
import { DataStatus } from '@dashlane/framework-react';
import useTranslate from 'libs/i18n/useTranslate';
import { HELPCENTER_ACCOUNT_RECOVERY_URL } from 'app/routes/constants';
import { AccountSubPanel } from 'webapp/account/account-subpanel/account-subpanel';
import { useIsAccountRecoveryEnabled } from '../hooks/useIsAccountRecoveryEnabled';
import { SettingsSection } from '../security-settings-root/settings-section/settings-section';
import { AdminAssistedRecoverySection } from './sections/admin-assisted-recovery-section/admin-assisted-recovery';
import { AdminRecoveryHelpSection } from './sections/admin-assisted-recovery-help-section/admin-assisted-recovery-help-section';
import { RecoveryKeySection } from './sections/recovery-key-section';
import { BiometricRecoverySection } from './sections/biometric-recovery-section';
const I18N_KEYS = {
    ACCOUNT_RECOVERY_PANEL_TITLE: 'webapp_account_security_settings_account_recovery_section_title',
    LEARN_MORE_LINK: 'webapp_account_security_settings_account_recovery_section_help_link',
};
enum AccountRecoveryActivePanel {
    Root,
    AdminRecoveryHelpPanel
}
export interface Props {
    onNavigateOut: () => void;
}
export const AccountRecoveryRoot = ({ onNavigateOut }: Props) => {
    const isAdminAssistedRecoveryAvailableResult = useIsAccountRecoveryEnabled();
    const isAdminAssistedRecoveryAvailable = isAdminAssistedRecoveryAvailableResult.status === DataStatus.Success &&
        isAdminAssistedRecoveryAvailableResult.data;
    const [activePanel, setActivePanel] = useState(AccountRecoveryActivePanel.Root);
    const { translate } = useTranslate();
    const handleShowRootPanel = () => {
        setActivePanel(AccountRecoveryActivePanel.Root);
    };
    const handleShowAdminRecoveryHelp = () => {
        setActivePanel(AccountRecoveryActivePanel.AdminRecoveryHelpPanel);
    };
    return activePanel === AccountRecoveryActivePanel.AdminRecoveryHelpPanel ? (<AdminRecoveryHelpSection onNavigateOut={handleShowRootPanel}/>) : (<AccountSubPanel headingText={translate(I18N_KEYS.ACCOUNT_RECOVERY_PANEL_TITLE)} onNavigateOut={onNavigateOut}>
      <RecoveryKeySection />
      {isAdminAssistedRecoveryAvailable ? (<AdminAssistedRecoverySection showAdminRecoveryHelp={handleShowAdminRecoveryHelp}/>) : null}
      <BiometricRecoverySection />
      <SettingsSection>
        <Link target="_blank" rel="noopener noreferrer" href={HELPCENTER_ACCOUNT_RECOVERY_URL} color="ds.text.brand.standard" style={{ display: 'flex', alignItems: 'end' }}>
          <span style={{ marginRight: '6px', fontWeight: 'normal' }}>
            {translate(I18N_KEYS.LEARN_MORE_LINK)}
          </span>
          <Icon name="ActionOpenExternalLinkOutlined" size="small" color="ds.text.brand.standard"/>
        </Link>
      </SettingsSection>
    </AccountSubPanel>);
};
