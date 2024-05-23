import React, { useEffect } from 'react';
import { DataStatus } from '@dashlane/framework-react';
import useTranslate from 'libs/i18n/useTranslate';
import { ActivePanel } from 'webapp/account/security-settings/security-settings';
import { AccountSubPanel } from 'webapp/account/account-subpanel/account-subpanel';
import { useIsAccountRecoveryEnabled } from 'webapp/account/security-settings/hooks/useIsAccountRecoveryEnabled';
import { useWebAuthnAuthentication } from 'webapp/webauthn';
import { useTwoFactorAuthenticationInfo } from 'webapp/two-factor-authentication/hooks/';
import { refreshTwoFactorAuthenticationInfo, refreshU2FDevices, } from 'webapp/two-factor-authentication/services';
import { AccountRecoverySettingsSection } from './account-recovery-settings-section/account-recovery-settings-section';
import { ChangeMasterPasswordSection } from './change-master-password-section/change-master-password-section';
import { CryptoSettingsSection } from './crypto-settings-section/crypto-settings-section';
import { WebAuthnSettingsSection } from './webauthn-settings-section/webauthn-settings-section';
import { TwoFactorAuthenticationSettingsSection } from './two-factor-authentication-settings-section/two-factor-authentication-settings-section';
import { MasterPasswordSettings } from './master-password-settings/master-password-settings';
import { RecoveryKeySection } from '../account-recovery-root/sections/recovery-key-section';
import { useIsSSOUser } from '../hooks/useIsSSOUser';
import { useIsMPlessUser } from '../hooks/use-is-mpless-user';
export interface Props {
    onNavigateOut: () => void;
    changeActivePanel: (panel: ActivePanel) => void;
    onDialogStateChanged?: (isDialogOpened: boolean) => void;
}
const I18N_KEYS = {
    HEADING: 'webapp_account_security_settings_heading',
};
export const SecuritySettingsRoot = ({ onNavigateOut, changeActivePanel, onDialogStateChanged, }: Props) => {
    const { translate } = useTranslate();
    const isAccountRecoveryEnabledResult = useIsAccountRecoveryEnabled();
    const isAccountRecoveryEnabled = isAccountRecoveryEnabledResult.status === DataStatus.Success &&
        isAccountRecoveryEnabledResult.data;
    const isSSOUser = useIsSSOUser();
    const { status: isMPLessUserStatus, isMPLessUser } = useIsMPlessUser();
    const isWebChangeMasterPasswordAvailable = !isSSOUser && !isMPLessUser;
    const isRequireMasterPasswordAvailable = !isSSOUser && !isMPLessUser;
    const isLocalUnlockAvailable = !isMPLessUser;
    const webAuthnAuthentication = useWebAuthnAuthentication();
    const twoFactorAuthenticationInfo = useTwoFactorAuthenticationInfo();
    useEffect(() => {
        refreshTwoFactorAuthenticationInfo();
        refreshU2FDevices();
    }, []);
    const isAccountRecoveryAvailable = (!isSSOUser && !isMPLessUser) || isAccountRecoveryEnabled;
    return (<AccountSubPanel headingText={translate(I18N_KEYS.HEADING)} onNavigateOut={onNavigateOut}>
      {isLocalUnlockAvailable ? (<WebAuthnSettingsSection changeActivePanel={changeActivePanel} webAuthnOptedIn={webAuthnAuthentication.optedIn} authenticators={webAuthnAuthentication.authenticators} onDialogStateChanged={onDialogStateChanged}/>) : null}
      
      {isMPLessUserStatus !== DataStatus.Success ? null : !isMPLessUser ? (<TwoFactorAuthenticationSettingsSection changeActivePanel={changeActivePanel} onDialogStateChanged={onDialogStateChanged} twoFactorAuthenticationInfo={twoFactorAuthenticationInfo}/>) : null}
      {isWebChangeMasterPasswordAvailable ? (<ChangeMasterPasswordSection changeActivePanel={changeActivePanel} twoFactorAuthenticationInfo={twoFactorAuthenticationInfo}/>) : null}
      
      {isAccountRecoveryAvailable ? (<AccountRecoverySettingsSection changeActivePanel={changeActivePanel}/>) : null}

      
      {isMPLessUser ? <RecoveryKeySection /> : null}

      
      {isRequireMasterPasswordAvailable ? <MasterPasswordSettings /> : null}
      <CryptoSettingsSection />
    </AccountSubPanel>);
};
