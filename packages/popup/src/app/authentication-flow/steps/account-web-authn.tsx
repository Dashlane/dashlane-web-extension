import { Fragment, useEffect, useRef } from 'react';
import useTranslate from 'libs/i18n/useTranslate';
import { AuthenticationFlowContracts } from '@dashlane/authentication-contracts';
import { Button, jsx } from '@dashlane/design-system';
import { Mode, PageView, UserAskUseOtherAuthenticationEvent, } from '@dashlane/hermes';
import { useAnalyticsCommands } from '@dashlane/framework-react';
import { Result } from '@dashlane/framework-types';
import { BiometricOutlinedIcon, Heading, Paragraph, } from '@dashlane/ui-components';
import { logEvent } from 'src/libs/logs/logEvent';
import { FORM_SX_STYLES } from '../constants';
import { EmailHeader } from '../components';
import { triggerWebAuthn } from '../helpers/trigger-webauthn';
interface Props extends Omit<AuthenticationFlowContracts.AuthenticationFlowWebAuthnView, 'step'> {
    retryWebAuthnAuthentication: () => Promise<Result<undefined>>;
    switchToMasterPassword: () => Promise<Result<undefined>>;
    webAuthnAuthenticationFail: (params: {
        webAuthnError: string;
    }) => Promise<Result<undefined>>;
}
const I18N_KEYS = {
    TITLE: 'login/unlock_your_vault_label',
    BUTTON_USE_MP: 'login/webauthn_button_use_master_password',
    ERROR_TITLE: 'login/webauthn_error_title',
    ERROR_DESCRIPTION: 'login/webauthn_error_description',
    BUTTON_RETRY: 'login/webauthn_error_button_retry',
};
export const AccountWebAuthn = ({ loginEmail, error, switchToMasterPassword, retryWebAuthnAuthentication, webAuthnAuthenticationFail, localAccounts, }: Props) => {
    const { translate } = useTranslate();
    const { trackPageView } = useAnalyticsCommands();
    useEffect(() => {
        void trackPageView({
            pageView: PageView.LoginWebauthn,
        });
    }, []);
    const authAbortController = useRef<AbortController>(new AbortController());
    const webAuthnAuthentication = async () => {
        if (loginEmail) {
            const webAuthnResult = await triggerWebAuthn(loginEmail, authAbortController.current.signal);
            if (!webAuthnResult.success &&
                authAbortController.current.signal.aborted) {
                authAbortController.current = new AbortController();
            }
            else if (!webAuthnResult.success) {
                void webAuthnAuthenticationFail({
                    webAuthnError: webAuthnResult.error as string,
                });
            }
        }
    };
    const onUseMasterPasswordClick = () => {
        authAbortController.current.abort();
        void logEvent(new UserAskUseOtherAuthenticationEvent({
            next: Mode.MasterPassword,
            previous: Mode.Biometric,
        }));
        void switchToMasterPassword();
    };
    const onRetryWebAuthnAuthentication = () => {
        void retryWebAuthnAuthentication();
        void webAuthnAuthentication();
    };
    useEffect(() => {
        void webAuthnAuthentication();
    }, []);
    return (<>
      <EmailHeader loginEmail={loginEmail ?? ''} showAccountsActionsDropdown showLogoutDropdown={false} localAccounts={localAccounts}/>

      <form sx={FORM_SX_STYLES}>
        <Heading size="x-small" color="ds.text.neutral.catchy" sx={{ marginBottom: '24px' }}>
          {translate(error ? I18N_KEYS.ERROR_TITLE : I18N_KEYS.TITLE)}
        </Heading>

        <div sx={{
            margin: error ? '' : '24px auto',
            flexGrow: '1',
        }}>
          {error ? (<Paragraph size="medium" color="ds.text.neutral.standard">
              {translate(I18N_KEYS.ERROR_DESCRIPTION)}
            </Paragraph>) : (<BiometricOutlinedIcon size={80} color="ds.text.neutral.standard" aria-hidden="true"/>)}
        </div>

        <Button onClick={onUseMasterPasswordClick} fullsize size="large" sx={{ marginBottom: '8px' }}>
          {translate(I18N_KEYS.BUTTON_USE_MP)}
        </Button>
        {error ? (<Button onClick={onRetryWebAuthnAuthentication} mood="neutral" intensity="quiet" fullsize size="large">
            {translate(I18N_KEYS.BUTTON_RETRY)}
          </Button>) : null}
      </form>
    </>);
};
