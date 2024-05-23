import React, { useEffect, useState } from 'react';
import { Link } from '@dashlane/ui-components';
import { Button, Icon, Toggle } from '@dashlane/design-system';
import { DataStatus, useAnalyticsCommands } from '@dashlane/framework-react';
import { PageView } from '@dashlane/hermes';
import { HELPCENTER_ACCOUNT_RECOVERY_URL } from 'app/routes/constants';
import { SettingsSection } from 'webapp/account/security-settings/security-settings-root/settings-section/settings-section';
import { useIsRecoveryKeyEnabled } from 'auth/login-panel/authentication-flow/hooks/use-is-recovery-key-enabled';
import { AccountRecoveryKeyActivationContainer } from '../account-recovery-key/containers/account-recovery-key-activation-container';
import { AccountRecoveryKeyDeactivationContainer } from '../account-recovery-key/containers/account-recovery-key-deactivation-container';
import { useIsMPlessUser } from '../../hooks/use-is-mpless-user';
import useTranslate from 'libs/i18n/useTranslate';
const I18N_KEYS = {
    RECOVERY_KEY_TITLE: 'webapp_account_security_settings_account_recovery_section_recovery_key_title',
    RECOVERY_KEY_DESCRIPTION: 'webapp_account_security_settings_account_recovery_section_recovery_key_description',
    RECOVERY_KEY_DESCRIPTION_PASSWORDLESS: 'webapp_account_security_settings_account_recovery_section_recovery_key_description_password_less',
    GENERATE_NEW_KEY_BUTTON: 'webapp_account_security_settings_account_recovery_section_recovery_key_generate',
    LEARN_MORE_LINK: 'webapp_account_security_settings_account_recovery_section_help_link',
};
type CurrentAccountRecoveryKeyDialog = 'accountRecoveryKeyActivation' | 'accountRecoveryKeyDeactivation' | undefined;
export const RecoveryKeySection = () => {
    const { translate } = useTranslate();
    const { trackPageView } = useAnalyticsCommands();
    const { status: isMPLessUserStatus, isMPLessUser } = useIsMPlessUser();
    useEffect(() => {
        trackPageView({
            pageView: PageView.SettingsSecurityRecoveryKey,
        });
    }, []);
    const isAccountRecoveryKeyEnabled = useIsRecoveryKeyEnabled();
    const [currentDialog, setCurrentDialog] = useState<CurrentAccountRecoveryKeyDialog>(undefined);
    const onToggleSettingChangeModal = () => {
        setCurrentDialog(isAccountRecoveryKeyEnabled
            ? 'accountRecoveryKeyDeactivation'
            : 'accountRecoveryKeyActivation');
    };
    const onGenerateNewKeyClick = () => {
        setCurrentDialog('accountRecoveryKeyActivation');
    };
    return (<>
      <SettingsSection sectionTitle={translate(I18N_KEYS.RECOVERY_KEY_TITLE)} action={<Toggle id="recovery-key-toggle" checked={isAccountRecoveryKeyEnabled} onChange={onToggleSettingChangeModal}/>}>
        <div style={{ fontSize: '12px', marginBottom: '14px' }}>
          <label htmlFor="recovery-key-toggle">
            {isMPLessUserStatus !== DataStatus.Success
            ? null
            : isMPLessUser
                ? translate(I18N_KEYS.RECOVERY_KEY_DESCRIPTION_PASSWORDLESS)
                : translate(I18N_KEYS.RECOVERY_KEY_DESCRIPTION)}
          </label>
        </div>
        {isAccountRecoveryKeyEnabled ? (<Button intensity="quiet" mood="neutral" size="small" onClick={onGenerateNewKeyClick}>
            {translate(I18N_KEYS.GENERATE_NEW_KEY_BUTTON)}
          </Button>) : null}
        {isMPLessUserStatus !== DataStatus.Success ? null : isMPLessUser ? (<Link target="_blank" rel="noopener noreferrer" href={HELPCENTER_ACCOUNT_RECOVERY_URL} color="ds.text.brand.standard" style={{ display: 'flex', alignItems: 'end' }}>
            <span style={{ marginRight: '6px', fontWeight: 'normal' }}>
              {translate(I18N_KEYS.LEARN_MORE_LINK)}
            </span>
            <Icon name="ActionOpenExternalLinkOutlined" size="small" color="ds.text.brand.standard"/>
          </Link>) : null}
      </SettingsSection>
      {currentDialog === 'accountRecoveryKeyActivation' ? (<AccountRecoveryKeyActivationContainer onClose={() => setCurrentDialog(undefined)}/>) : null}
      {currentDialog === 'accountRecoveryKeyDeactivation' ? (<AccountRecoveryKeyDeactivationContainer onClose={() => setCurrentDialog(undefined)}/>) : null}
    </>);
};
