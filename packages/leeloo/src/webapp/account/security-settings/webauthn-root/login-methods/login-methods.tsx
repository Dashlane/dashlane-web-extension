import React from 'react';
import { AddIcon, IconButton } from '@dashlane/ui-components';
import { AuthenticatorDetails } from '@dashlane/communication';
import useTranslate from 'libs/i18n/useTranslate';
import { SettingsSection } from 'webapp/account/security-settings/security-settings-root/settings-section/settings-section';
import { WebAuthnAuthenticator } from 'webapp/account/security-settings/webauthn-root/webauthn-auhenticator/webauthn-authenticator';
export interface Props {
    authenticators?: AuthenticatorDetails[];
    userHasWebAuthnPlatformAuthenticator: boolean;
    onClickTriggerWebAuthnAuthenticator: () => void;
    onRemoveWebAuthnAuthenticator: (credentialId: string) => void;
}
const I18N_KEYS = {
    ALL_AUTHENTICATORS_ADD_BUTTON: 'webapp_account_security_settings_passwordless_login_methods_all_authenticators_add',
    NO_PLATFORM_ADD_BUTTON: 'webapp_account_security_settings_passwordless_login_methods_noplatform_add',
    LOGIN_METHODS_TITLE: 'webapp_account_security_settings_passwordless_login_methods_title',
    TITLE_PLATFORM: 'webapp_account_security_settings_passwordless_login_methods_plaftorm',
    TITLE_ROAMING: 'webapp_account_security_settings_passwordless_login_methods_roaming',
};
export const LoginMethods = ({ authenticators, userHasWebAuthnPlatformAuthenticator, onClickTriggerWebAuthnAuthenticator, onRemoveWebAuthnAuthenticator, }: Props) => {
    const { translate } = useTranslate();
    const getAuthenticatorsWithName = (authenticatorsData: AuthenticatorDetails[]): AuthenticatorDetails[] => {
        if (authenticatorsData.length === 1 && !authenticatorsData[0].isRoaming) {
            authenticatorsData[0].name = translate(I18N_KEYS.TITLE_PLATFORM);
            return [...authenticatorsData];
        }
        let roamingNumber = 0;
        let platformNumber = 0;
        return authenticatorsData.reduce((total: AuthenticatorDetails[], curr) => {
            let name: string;
            if (curr.isRoaming) {
                roamingNumber++;
                name = `${translate(I18N_KEYS.TITLE_ROAMING)} ${roamingNumber}`;
            }
            else {
                platformNumber++;
                name = `${translate(I18N_KEYS.TITLE_PLATFORM)} ${platformNumber}`;
            }
            const value: AuthenticatorDetails = {
                ...curr,
                name,
            };
            total.push(value);
            return total;
        }, []);
    };
    const addButtonTitle = userHasWebAuthnPlatformAuthenticator
        ? I18N_KEYS.ALL_AUTHENTICATORS_ADD_BUTTON
        : I18N_KEYS.NO_PLATFORM_ADD_BUTTON;
    if (!authenticators) {
        return null;
    }
    const data = getAuthenticatorsWithName(authenticators);
    return (<SettingsSection sectionTitle={translate(I18N_KEYS.LOGIN_METHODS_TITLE)} action={<IconButton type="button" size="small" onClick={onClickTriggerWebAuthnAuthenticator} aria-label={translate(addButtonTitle)} title={translate(addButtonTitle)} icon={<AddIcon size={16}/>}/>}>
      
      <ol>
        {data.map((authenticator: AuthenticatorDetails) => {
            return (<WebAuthnAuthenticator key={authenticator.credentialId} authenticator={authenticator} onRemoveAuthenticator={onRemoveWebAuthnAuthenticator}/>);
        })}
      </ol>
    </SettingsSection>);
};
