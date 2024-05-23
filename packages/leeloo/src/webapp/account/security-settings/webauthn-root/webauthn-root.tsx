import React, { useCallback, useEffect, useState } from 'react';
import useTranslate from 'libs/i18n/useTranslate';
import { carbonConnector } from 'libs/carbon/connector';
import { getExtensionId } from 'libs/extension';
import { hasWebAuthnPlatformAuthenticator, isRoamingCredential, } from 'webapp/webauthn/helpers/browserWebAuthnAuthentication';
import { startAttestation } from 'webapp/webauthn/helpers/credential';
import { AccountSubPanel } from 'webapp/account/account-subpanel/account-subpanel';
import { LoginMethods } from './login-methods/login-methods';
import { useWebAuthn, useWebAuthnAuthentication } from 'webapp/webauthn';
export interface Props {
    onNavigateOut: () => void;
    onDialogStateChanged?: (isDialogOpened: boolean) => void;
}
const I18N_KEYS = {
    NO_PLATFORM_HEADING: 'webapp_account_security_settings_passwordless_noplatform_title',
    ALL_AUTHENTICATORS_HEADING: 'webapp_account_security_settings_passwordless_all_authenticators_title',
};
export const WebAuthnRoot = ({ onNavigateOut, onDialogStateChanged, }: Props) => {
    const { translate } = useTranslate();
    const { authenticators, optedIn } = useWebAuthnAuthentication();
    const { openWebAuthnRemoveLastAuthenticatorDialog, onRemoveWebAuthnAuthenticator, } = useWebAuthn({ onDialogStateChanged });
    const [userHasWebAuthnPlatformAuthenticator, setUserHasWebAuthnPlatformAuthenticator,] = useState(false);
    useEffect(() => {
        if (userHasWebAuthnPlatformAuthenticator) {
            return;
        }
        const hasAuthenticator = async () => {
            const userHasAuthenticator = await hasWebAuthnPlatformAuthenticator();
            setUserHasWebAuthnPlatformAuthenticator(userHasAuthenticator);
        };
        hasAuthenticator();
    }, [userHasWebAuthnPlatformAuthenticator]);
    const onClickTriggerWebAuthnAuthenticator = async (): Promise<void> => {
        const relyingPartyId = getExtensionId();
        if (!relyingPartyId) {
            throw new Error('WebAuthn attestation cannot be completed as extension Id is missing');
        }
        const result = await carbonConnector.initRegisterWebAuthnAuthenticator({
            relyingPartyId,
        });
        if (result.success) {
            const credential = await startAttestation(result.response.publicKeyOptions);
            const isRoaming = isRoamingCredential();
            await carbonConnector.registerWebAuthnAuthenticator({
                credential,
                isRoaming,
            });
        }
    };
    const handleRemoveWebAuthnAuthenticator = useCallback((credentialId: string): void => {
        const authenticator = authenticators?.find((element) => element.credentialId === credentialId);
        if (authenticator) {
            const isLastAuthenticator = authenticators?.length === 1 && optedIn;
            const isRoaming = Boolean(authenticator?.isRoaming);
            if (isLastAuthenticator) {
                openWebAuthnRemoveLastAuthenticatorDialog(credentialId, isRoaming);
            }
            else {
                onRemoveWebAuthnAuthenticator(credentialId, isRoaming);
            }
        }
    }, [
        optedIn,
        authenticators,
        onRemoveWebAuthnAuthenticator,
        openWebAuthnRemoveLastAuthenticatorDialog,
    ]);
    const panelHeading = userHasWebAuthnPlatformAuthenticator
        ? I18N_KEYS.ALL_AUTHENTICATORS_HEADING
        : I18N_KEYS.NO_PLATFORM_HEADING;
    return (<AccountSubPanel headingText={translate(panelHeading)} onNavigateOut={onNavigateOut}>
      <LoginMethods userHasWebAuthnPlatformAuthenticator={userHasWebAuthnPlatformAuthenticator} onClickTriggerWebAuthnAuthenticator={onClickTriggerWebAuthnAuthenticator} authenticators={authenticators} onRemoveWebAuthnAuthenticator={handleRemoveWebAuthnAuthenticator}/>
    </AccountSubPanel>);
};
