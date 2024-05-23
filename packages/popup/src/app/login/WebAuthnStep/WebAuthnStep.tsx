import * as React from 'react';
import { Mode, UserAskUseOtherAuthenticationEvent } from '@dashlane/hermes';
import type { InitOpenSessionWithWebAuthnAuthenticatorsInfo } from '@dashlane/communication';
import { BiometricOutlinedIcon, colors } from '@dashlane/ui-components';
import { logEvent } from 'src/libs/logs/logEvent';
import FormWrapper from 'app/login/FormWrapper';
import useTranslate from 'libs/i18n/useTranslate';
import { carbonConnector } from 'src/carbonConnector';
import { startAssertion } from 'app/login/WebAuthnStep/helpers/credential';
import styles from 'app/login/WebAuthnStep/styles.css';
import WebAuthnFormActions from './WebAuthnFormActions';
export interface WebAuthnStepProps {
    login: string;
    onUseMasterPassword: () => void;
    getExtensionId: () => string;
    showError: () => void;
}
const I18N_KEYS = {
    TITLE: 'login/unlock_your_vault_label',
    BUTTON_USE_MP: 'login/webauthn_button_use_master_password',
};
const Step = ({ login, onUseMasterPassword, getExtensionId, showError, }: WebAuthnStepProps) => {
    const { translate } = useTranslate();
    const authAbortController = React.useRef<AbortController>(new AbortController());
    const handleWebAuthn = async () => {
        try {
            const relyingPartyId = getExtensionId();
            if (!relyingPartyId) {
                throw new Error('WebAuthn attestation cannot be completed as extension Id is missing');
            }
            const result = await carbonConnector.initOpenSessionWithWebAuthnAuthenticator({
                relyingPartyId,
                login,
            });
            if (!result.success) {
                showError();
                return;
            }
            const registerWebAuthnAuthenticator = await startAssertion(result.response.publicKeyOptions, authAbortController.current.signal);
            const authenticator = result.response.authenticatorsInfo.find((authenticatorInfo: InitOpenSessionWithWebAuthnAuthenticatorsInfo) => {
                return (authenticatorInfo.credentialId === registerWebAuthnAuthenticator.id);
            });
            const openSessionResult = await carbonConnector.openSessionWithWebAuthnAuthenticator({
                credential: registerWebAuthnAuthenticator,
                login,
                isRoamingAuthenticator: authenticator?.isRoaming,
            });
            if (!openSessionResult.success) {
                showError();
            }
        }
        catch {
            showError();
        }
    };
    const onUseMasterPasswordClick = () => {
        if (authAbortController) {
            authAbortController.current.abort();
            authAbortController.current = new AbortController();
        }
        logEvent(new UserAskUseOtherAuthenticationEvent({
            next: Mode.MasterPassword,
            previous: Mode.Biometric,
        }));
        onUseMasterPassword();
    };
    React.useEffect(() => {
        handleWebAuthn();
    }, []);
    return (<FormWrapper title={{
            text: translate(I18N_KEYS.TITLE),
            labelId: 'webauthn_label',
        }} customActions={<WebAuthnFormActions primaryButtonText={translate(I18N_KEYS.BUTTON_USE_MP)} onPrimaryButtonClick={onUseMasterPasswordClick}/>}>
      <div className={styles.icon}>
        <BiometricOutlinedIcon size={80} color={colors.midGreen01} aria-hidden="true"/>
      </div>
    </FormWrapper>);
};
export const WebAuthnStep = React.memo(Step);
