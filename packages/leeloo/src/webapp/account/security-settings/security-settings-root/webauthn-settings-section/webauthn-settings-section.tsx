import React, { useCallback, useMemo, useState } from 'react';
import { jsx, Paragraph, Toggle } from '@dashlane/design-system';
import { colors, FlexContainer, ForwardIcon, InfoBox, Link, ThemeUIStyleObject, } from '@dashlane/ui-components';
import { AuthenticatorDetails } from '@dashlane/communication';
import useTranslate from 'libs/i18n/useTranslate';
import { browserSupportsWebAuthnAuthentication, useHasWebAuthnPlatformAuthenticator, useWebAuthn, } from 'webapp/webauthn';
import { useIsWebAuthnAvailable } from 'webapp/webauthn/hooks/use-is-web-authn-available';
import { WebauthnNotAvailableReasons } from 'webapp/types';
import { SettingsSection } from 'webapp/account/security-settings/security-settings-root/settings-section/settings-section';
import { WebAuthnSettingsNotAvailableSection } from './section-not-available';
import { ActivePanel } from '../../security-settings';
import { WebAuthnSettingsLoadingSection } from './section-loading';
const I18N_KEYS = {
    ALL_AUTHENTICATORS_TOGGLE_ARIA_LABEL: 'webapp_account_security_settings_passwordless_all_authenticators_toggle_aria_label',
    ALL_AUTHENTICATORS_TITLE: 'webapp_account_security_settings_passwordless_all_authenticators_title',
    ALL_AUTHENTICATORS_DESC: 'webapp_account_security_settings_passwordless_all_authenticators_desc_markup',
    VIEW_OPTIONS_LINK: 'webapp_account_security_settings_passwordless_view_options',
    NO_PLATFORM_TITLE: 'webapp_account_security_settings_passwordless_noplatform_title',
    NO_PLATFORM_DESC: 'webapp_account_security_settings_passwordless_noplatform_desc_markup',
    BROWSER_NOT_SUPPORTED: 'webapp_account_security_settings_passwordless_disabled_feature_unsupported',
};
const I18N_WEBAUTHN_NOT_AVAILABLE = {
    [WebauthnNotAvailableReasons.USING_WEBAPP]: {
        TITLE: 'webapp_account_security_settings_passwordless_all_authenticators_title',
        MESSAGE: 'webapp_account_security_settings_passwordless_disabled_outside_extension',
    },
    [WebauthnNotAvailableReasons.USING_FIREFOX]: {
        TITLE: 'webapp_account_security_settings_passwordless_all_authenticators_title',
        MESSAGE: 'webapp_account_security_settings_passwordless_disabled_feature_unsupported',
    },
    [WebauthnNotAvailableReasons.ENABLED_SSO]: {
        TITLE: 'webapp_account_security_settings_passwordless_all_authenticators_title',
        MESSAGE: 'webapp_account_security_settings_passwordless_disabled_by_sso',
    },
    [WebauthnNotAvailableReasons.ENABLED_2FA]: {
        TITLE: 'webapp_account_security_settings_passwordless_all_authenticators_title',
        MESSAGE: 'webapp_account_security_settings_passwordless_disabled_by_two_factor_authentication',
    },
};
const SX_STYLES: {
    [key: string]: ThemeUIStyleObject;
} = {
    WEBAUTHN_SECTION_DESCRIPTION: {
        marginBottom: '8px',
        '& p:first-child': {
            marginBottom: '15px',
        },
    },
    WEBAUTHN_SECTION_LINK_BUTTON: {
        display: 'flex',
        alignItems: 'center',
        textDecoration: 'none',
    },
    WEBAUTHN_SECTION_LINK_BUTTON_CONTENT: {
        marginRight: '8px',
    },
};
interface Props {
    authenticators?: AuthenticatorDetails[];
    webAuthnOptedIn: boolean;
    changeActivePanel: (panel: ActivePanel) => void;
    onDialogStateChanged?: (isDialogOpened: boolean) => void;
}
export const WebAuthnSettingsSection = ({ authenticators, webAuthnOptedIn, changeActivePanel, onDialogStateChanged, }: Props) => {
    const { translate } = useTranslate();
    const isWebAuthnAvailable = useIsWebAuthnAvailable();
    const [userBrowserSupportsWebAuthnAuthentication] = useState(browserSupportsWebAuthnAuthentication());
    const { openWebAuthnEnablerDialog, openWebAuthnDisablerDialog } = useWebAuthn({
        onDialogStateChanged,
    });
    const userHasWebAuthnPlatformAuthenticator = useHasWebAuthnPlatformAuthenticator();
    const showDescription = useMemo(() => userBrowserSupportsWebAuthnAuthentication &&
        !webAuthnOptedIn &&
        !authenticators?.length, [
        authenticators?.length,
        userBrowserSupportsWebAuthnAuthentication,
        webAuthnOptedIn,
    ]);
    const showViewOptions = useMemo(() => userBrowserSupportsWebAuthnAuthentication &&
        (webAuthnOptedIn || authenticators?.length), [
        authenticators?.length,
        userBrowserSupportsWebAuthnAuthentication,
        webAuthnOptedIn,
    ]);
    const onWebAuthnChange = useCallback((event: React.ChangeEvent<HTMLInputElement>): void => {
        const isChecked: boolean = event.currentTarget.checked;
        isChecked ? openWebAuthnEnablerDialog() : openWebAuthnDisablerDialog();
    }, [openWebAuthnEnablerDialog, openWebAuthnDisablerDialog]);
    const onClickViewOptions = useCallback((event: React.MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault();
        changeActivePanel(ActivePanel.WebAuthn);
    }, [changeActivePanel]);
    if (userHasWebAuthnPlatformAuthenticator === null) {
        return null;
    }
    const sectionTitle = userHasWebAuthnPlatformAuthenticator
        ? I18N_KEYS.ALL_AUTHENTICATORS_TITLE
        : I18N_KEYS.NO_PLATFORM_TITLE;
    const description = userHasWebAuthnPlatformAuthenticator
        ? I18N_KEYS.ALL_AUTHENTICATORS_DESC
        : I18N_KEYS.NO_PLATFORM_DESC;
    if (!isWebAuthnAvailable.result &&
        isWebAuthnAvailable.reason === WebauthnNotAvailableReasons.DATA_LOADING) {
        return <WebAuthnSettingsLoadingSection />;
    }
    else if (!isWebAuthnAvailable.result &&
        isWebAuthnAvailable.reason !== undefined) {
        const i18nWebAuthn = I18N_WEBAUTHN_NOT_AVAILABLE[isWebAuthnAvailable.reason];
        return (<WebAuthnSettingsNotAvailableSection title={translate(i18nWebAuthn.TITLE)} message={translate(i18nWebAuthn.MESSAGE)}/>);
    }
    else {
        return (<SettingsSection sectionTitle={translate(sectionTitle)} action={<Toggle aria-label={translate(I18N_KEYS.ALL_AUTHENTICATORS_TOGGLE_ARIA_LABEL)} checked={webAuthnOptedIn} onChange={onWebAuthnChange} disabled={!userBrowserSupportsWebAuthnAuthentication}/>}>
        <FlexContainer as={Paragraph} alignItems="flex-start" flexDirection="column" color="ds.text.neutral.standard" textStyle="ds.body.standard.regular">
          {!userBrowserSupportsWebAuthnAuthentication ? (<InfoBox severity="subtle" size="small" title={translate(I18N_KEYS.BROWSER_NOT_SUPPORTED)}/>) : null}

          {showDescription ? (<div sx={SX_STYLES.WEBAUTHN_SECTION_DESCRIPTION}>
              {translate.markup(description)}
            </div>) : null}

          {showViewOptions ? (<Link href="#" role="button" color={colors.midGreen00} sx={SX_STYLES.WEBAUTHN_SECTION_LINK_BUTTON} onClick={onClickViewOptions}>
              <span sx={SX_STYLES.WEBAUTHN_SECTION_LINK_BUTTON_CONTENT}>
                {translate(I18N_KEYS.VIEW_OPTIONS_LINK)}
              </span>
              <span aria-hidden="true">
                <ForwardIcon size={12}/>
              </span>
            </Link>) : null}
        </FlexContainer>
      </SettingsSection>);
    }
};
