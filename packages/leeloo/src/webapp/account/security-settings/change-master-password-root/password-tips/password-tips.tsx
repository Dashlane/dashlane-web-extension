import React from 'react';
import { AccountSubPanel } from 'webapp/account/account-subpanel/account-subpanel';
import useTranslate from 'libs/i18n/useTranslate';
import { PasswordTipsContent } from 'password-tips-content/password-tips-content';
import { SettingsSection } from '../../security-settings-root/settings-section/settings-section';
export interface Props {
    onNavigateOut: () => void;
}
const I18N_KEYS = {
    HEADING: 'webapp_account_security_settings_passwordtips_panel_heading',
    SUB_TITLE: 'webapp_account_security_settings_passwordtips_panel_subtitle',
};
export const PasswordTips = ({ onNavigateOut }: Props) => {
    const { translate } = useTranslate();
    return (<AccountSubPanel headingText={translate(I18N_KEYS.HEADING)} onNavigateOut={onNavigateOut}>
      <SettingsSection sectionTitle={translate(I18N_KEYS.SUB_TITLE)}>
        <PasswordTipsContent />
      </SettingsSection>
    </AccountSubPanel>);
};
