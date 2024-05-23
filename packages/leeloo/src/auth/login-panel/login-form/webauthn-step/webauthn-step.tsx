import React, { useEffect, useState } from 'react';
import { Mode, UserAskUseOtherAuthenticationEvent } from '@dashlane/hermes';
import { BiometricOutlinedIcon, Button, FlexChild, FlexContainer, Heading, Paragraph, } from '@dashlane/ui-components';
import useTranslate from 'libs/i18n/useTranslate';
import { logEvent } from 'libs/logs/logEvent';
import { EmailHeading } from 'auth/login-panel/login-form/email-heading/email-heading';
import styles from './webauthn-step.css';
import { initOpenSessionWithWebAuthnAuthenticator, openSessionWithWebAuthnAuthenticator, } from 'webapp/webauthn/services';
interface WebAuthnStepProps {
    login: string;
    switchToPasswordStep: () => void;
    switchToEmailStep: () => void;
}
export const I18N_KEYS = {
    BUTTON_LOGIN_WEBAUTHN: 'webapp_login_form_webauthn_button_login',
    BUTTON_RETRY_WEBAUTHN: 'webapp_login_form_webauthn_error_title_button_retry',
    BUTTON_USE_MASTER_PASSWORD: 'webapp_login_form_webauthn_button_use_master_password',
    DESCRIPTION: 'webapp_login_form_webauthn_error_title_description',
    TITLE: 'webapp_login_form_webauthn_error_title',
};
export const WebAuthnStep = ({ login, switchToPasswordStep, switchToEmailStep, }: WebAuthnStepProps) => {
    const { translate } = useTranslate();
    const [isError, setIsError] = useState(false);
    const authAbortController = React.useRef<AbortController>(new AbortController());
    const openSession = async () => {
        try {
            const initOpenSessionResult = await initOpenSessionWithWebAuthnAuthenticator(login);
            if (!initOpenSessionResult.success) {
                setIsError(true);
                return;
            }
            const openSessionResult = await openSessionWithWebAuthnAuthenticator(initOpenSessionResult, login, authAbortController.current.signal);
            if (!openSessionResult.success) {
                setIsError(true);
            }
        }
        catch (error) {
            setIsError(true);
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
        switchToPasswordStep();
    };
    useEffect(() => {
        openSession();
    }, []);
    const openSessionWithAuthn = () => {
        setIsError(false);
        openSession();
    };
    return (<FlexContainer flexDirection="column">
      <EmailHeading login={login} onBackToEmailStepClick={switchToEmailStep}/>

      <FlexContainer flexDirection="column" alignItems="center" justifyContent="center">
        <FlexChild sx={{ mb: 50, mt: 24 }} alignSelf="center">
          <BiometricOutlinedIcon size={60} aria-hidden="true"/>
        </FlexChild>
      </FlexContainer>
      {isError ? (<>
          <FlexChild>
            <Heading size="x-small">{translate(I18N_KEYS.TITLE)}</Heading>
          </FlexChild>
          <FlexChild>
            <Paragraph id="disableDialogBody" color="neutrals.8" sx={{ mt: '10px', mb: '26px' }}>
              {translate(I18N_KEYS.DESCRIPTION)}
            </Paragraph>
          </FlexChild>
        </>) : null}
      <FlexChild sx={{ mb: 5 }}>
        <Button nature="primary" type="button" onClick={onUseMasterPasswordClick} className={styles.actionButton}>
          {translate(I18N_KEYS.BUTTON_USE_MASTER_PASSWORD)}
        </Button>
        {isError ? (<FlexChild sx={{ mt: 3 }}>
            <Button nature="secondary" type="button" onClick={openSessionWithAuthn} className={styles.actionButton}>
              {translate(I18N_KEYS.BUTTON_RETRY_WEBAUTHN)}
            </Button>
          </FlexChild>) : null}
      </FlexChild>
    </FlexContainer>);
};
