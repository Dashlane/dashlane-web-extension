import { useEffect, useRef } from 'react';
import { AuthenticationFlowContracts } from '@dashlane/authentication-contracts';
import { Button, Heading, Icon, jsx, Paragraph } from '@dashlane/design-system';
import { Mode, PageView, UserAskUseOtherAuthenticationEvent, } from '@dashlane/hermes';
import { useAnalyticsCommands } from '@dashlane/framework-react';
import { Result } from '@dashlane/framework-types';
import { FlexChild, FlexContainer } from '@dashlane/ui-components';
import useTranslate from 'libs/i18n/useTranslate';
import { logEvent } from 'libs/logs/logEvent';
import { EmailHeader, Header, WebappLoginLayout } from '../components';
import { triggerWebAuthn } from '../helpers/trigger-webauthn';
interface Props extends Omit<AuthenticationFlowContracts.AuthenticationFlowWebAuthnView, 'step'> {
    retryWebAuthnAuthentication: () => Promise<Result<undefined>>;
    switchToMasterPassword: () => Promise<Result<undefined>>;
    webAuthnAuthenticationFail: (params: {
        webAuthnError: string;
    }) => Promise<Result<undefined>>;
}
const I18N_KEYS = {
    HEADING: 'webapp_login_form_heading_log_in',
    BUTTON_RETRY_WEBAUTHN: 'webapp_login_form_webauthn_error_title_button_retry',
    BUTTON_USE_MASTER_PASSWORD: 'webapp_login_form_webauthn_button_use_master_password',
    ERROR_DESCRIPTION: 'webapp_login_form_webauthn_error_title_description',
    ERROR_TITLE: 'webapp_login_form_webauthn_error_title',
};
export const AccountWebAuthn = ({ loginEmail, error, retryWebAuthnAuthentication, switchToMasterPassword, webAuthnAuthenticationFail, }: Props) => {
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
                webAuthnAuthenticationFail({ webAuthnError: webAuthnResult.error });
            }
        }
    };
    const onUseMasterPasswordClick = () => {
        if (authAbortController.current) {
            authAbortController.current.abort();
        }
        logEvent(new UserAskUseOtherAuthenticationEvent({
            next: Mode.MasterPassword,
            previous: Mode.Biometric,
        }));
        switchToMasterPassword();
    };
    const onRetryWebAuthnAuthentication = () => {
        retryWebAuthnAuthentication();
        webAuthnAuthentication();
    };
    useEffect(() => {
        webAuthnAuthentication();
    }, []);
    return (<WebappLoginLayout>
      <Header text={translate(I18N_KEYS.HEADING)}/>
      <EmailHeader selectedEmail={loginEmail}/>

      <FlexContainer flexDirection="column" alignItems="center" justifyContent="center">
        <FlexChild sx={{ margin: '18px 0px' }} alignSelf="center">
          <Icon sx={{ size: '60px' }} name="FingerprintOutlined" color="ds.text.neutral.standard" aria-hidden="true"/>
        </FlexChild>
      </FlexContainer>
      {error ? (<FlexContainer>
          <Heading textStyle="ds.title.block.medium" as={'h3'}>
            {translate(I18N_KEYS.ERROR_TITLE)}
          </Heading>
          <Paragraph id="disableDialogBody" color="ds.text.neutral.quiet" sx={{ marginTop: '16px' }}>
            {translate(I18N_KEYS.ERROR_DESCRIPTION)}
          </Paragraph>
        </FlexContainer>) : null}
      <FlexContainer>
        <Button onClick={onUseMasterPasswordClick} fullsize size="large">
          {translate(I18N_KEYS.BUTTON_USE_MASTER_PASSWORD)}
        </Button>
        {error ? (<Button onClick={onRetryWebAuthnAuthentication} intensity="quiet" size="large" fullsize sx={{ marginTop: '8px' }}>
            {translate(I18N_KEYS.BUTTON_RETRY_WEBAUTHN)}
          </Button>) : null}
      </FlexContainer>
    </WebappLoginLayout>);
};
