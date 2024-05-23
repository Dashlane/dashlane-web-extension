import React, { useCallback } from 'react';
import useTranslate from 'libs/i18n/useTranslate';
import { colors, jsx } from '@dashlane/ui-components';
import { TwoFactorAuthenticationClientInfo } from '@dashlane/communication';
import { Toggle } from '@dashlane/design-system';
import { SettingsSection } from 'webapp/account/security-settings/security-settings-root/settings-section/settings-section';
import { ActivePanel } from 'webapp/account/security-settings/security-settings';
import { TwoFactorAuthenticationOptions } from 'webapp/account/security-settings/security-settings-root/two-factor-authentication-settings-section/two-factor-authentication-options';
import { EnforcedTwoFactorAuthenticationEnabled } from 'webapp/account/security-settings/security-settings-root/two-factor-authentication-settings-section/enforced-two-factor-authentication-enabled';
import { TwoFactorAuthenticationDisabled } from 'webapp/account/security-settings/security-settings-root/two-factor-authentication-settings-section/two-factor-authentication-disabled';
import { useTwoFactorAuthentication } from 'webapp/two-factor-authentication/hooks';
import { logTwoFactorAuthenticationDisableStartEvent } from 'webapp/two-factor-authentication/logs/disable-flow-logs';
import { logTwoFactorAuthenticationEnableStartEvent } from 'webapp/two-factor-authentication/logs/enable-flow-logs';
const I18N_KEYS = {
    TWO_FACTOR_AUTHENTICATION_TITLE: 'webapp_account_security_settings_two_factor_authentication_title',
    TWO_FACTOR_AUTHENTICATION_TOGGLE_ARIA_LABEL: 'webapp_account_security_settings_two_factor_authentication_toggle_aria_label',
};
const SX_STYLES = {
    SECTION_CONTAINER: {
        fontSize: 1,
        marginTop: '5px',
        display: 'inline-block',
        color: colors.grey00,
    },
};
interface SectionAvailableProps {
    changeActivePanel: (panel: ActivePanel) => void;
    onDialogStateChanged?: (isDialogOpened: boolean) => void;
    twoFactorAuthenticationInfo: TwoFactorAuthenticationClientInfo;
}
export const TwoFactorAuthenticationAvailableSection = ({ changeActivePanel, onDialogStateChanged, twoFactorAuthenticationInfo, }: SectionAvailableProps) => {
    const { translate } = useTranslate();
    const { isTwoFactorAuthenticationEnabled, isTwoFactorAuthenticationEnforced, } = twoFactorAuthenticationInfo;
    const { openTwoFactorAuthenticationDisablerDialog, openTwoFactorAuthenticationEnablerDialog, } = useTwoFactorAuthentication({ onDialogStateChanged });
    const onTwoFactorAuthenticationToggleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>): void => {
        const isChecked: boolean = event.currentTarget.checked;
        if (!isChecked) {
            logTwoFactorAuthenticationDisableStartEvent();
            openTwoFactorAuthenticationDisablerDialog();
        }
        else {
            logTwoFactorAuthenticationEnableStartEvent();
            openTwoFactorAuthenticationEnablerDialog();
        }
    }, [
        openTwoFactorAuthenticationDisablerDialog,
        openTwoFactorAuthenticationEnablerDialog,
    ]);
    const isEnforced2FAEnabled = isTwoFactorAuthenticationEnforced && isTwoFactorAuthenticationEnabled;
    return (<SettingsSection sectionTitle={translate(I18N_KEYS.TWO_FACTOR_AUTHENTICATION_TITLE)} action={<Toggle data-testid="two-factor-authentication-settings-option-toggle" id="two-factor-authentication-settings-option" name="two-factor-authentication-settings-option" checked={isTwoFactorAuthenticationEnabled} onChange={onTwoFactorAuthenticationToggleChange} aria-label={translate(I18N_KEYS.TWO_FACTOR_AUTHENTICATION_TOGGLE_ARIA_LABEL)}/>}>
      <div sx={SX_STYLES.SECTION_CONTAINER}>
        {isEnforced2FAEnabled ? (<>
            <EnforcedTwoFactorAuthenticationEnabled />
            <TwoFactorAuthenticationOptions changeActivePanel={changeActivePanel}/>
          </>) : isTwoFactorAuthenticationEnabled ? (<TwoFactorAuthenticationOptions changeActivePanel={changeActivePanel}/>) : (<TwoFactorAuthenticationDisabled />)}
      </div>
    </SettingsSection>);
};
