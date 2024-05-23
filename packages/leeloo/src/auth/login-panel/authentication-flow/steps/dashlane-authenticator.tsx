import { Fragment, useEffect, useState } from 'react';
import { AuthenticationCode } from '@dashlane/communication';
import { AuthenticationFlowContracts } from '@dashlane/authentication-contracts';
import { Button, Heading, jsx, Paragraph } from '@dashlane/design-system';
import { PageView } from '@dashlane/hermes';
import { useAnalyticsCommands } from '@dashlane/framework-react';
import { Result } from '@dashlane/framework-types';
import { FlexContainer, Link, LoadingIcon } from '@dashlane/ui-components';
import { WebappLoginLayout } from 'auth/login-panel/authentication-flow/components';
import { useCarbonDeathListener } from 'auth/login-panel/authentication-flow/hooks/use-carbon-death-listener';
import useTranslate from 'libs/i18n/useTranslate';
import failureLottie from 'libs/assets/lottie-failure.json';
import Animation from 'libs/dashlane-style/animation';
const I18N_KEYS = {
    DASHLANE_AUTHENTICATOR_TITLE: 'webapp_dashlane_authenticator_authentication_title',
    CANT_ACCESS_APP: 'webapp_dashlane_authenticator_authentication_cant_access_your_app',
    SEND_CODE_BY_EMAIL: 'webapp_dashlane_authenticator_authentication_send_code_by_email_link',
    BUTTON_SEND_PUSH_NOTIFICATION: 'webapp_dashlane_authenticator_authentication_send_another_push_button',
};
const I18N_ERROR_KEYS_MAPPER = {
    generic: '_common_generic_error',
    [AuthenticationCode[AuthenticationCode.DASHLANE_AUTHENTICATOR_PUSH_NOTIFICATION_DENIED]]: 'webapp_dashlane_authenticator_authentication_error_denied',
    [AuthenticationCode[AuthenticationCode.TOKEN_EXPIRED]]: 'webapp_dashlane_authenticator_authentication_error_timeout',
};
interface Props extends Omit<AuthenticationFlowContracts.AuthenticationFlowEmailTokenView, 'step'> {
    resendPushNotification: () => Promise<Result<undefined>>;
    switchToEmailToken: () => Promise<Result<undefined>>;
}
export const DashlaneAuthenticator = ({ error, resendPushNotification, switchToEmailToken, }: Props) => {
    const { translate } = useTranslate();
    const [isCarbonActive, setIsCarbonActive] = useState(true);
    const { trackPageView } = useAnalyticsCommands();
    const handleResendPushNotification = () => {
        setIsCarbonActive(true);
        resendPushNotification();
    };
    const handleSwitchToEmailToken = () => {
        switchToEmailToken();
    };
    useCarbonDeathListener(() => {
        setIsCarbonActive(false);
    });
    useEffect(() => {
        void trackPageView({
            pageView: PageView.LoginTokenAuthenticator,
        });
    }, []);
    return (<WebappLoginLayout>
      <Heading color="ds.text.neutral.catchy" as={'h2'}>
        {translate(I18N_KEYS.DASHLANE_AUTHENTICATOR_TITLE)}
      </Heading>
      {!error && isCarbonActive ? (<LoadingIcon data-testid="dashlane-authenticator-loading-icon" size="88px" color="ds.container.expressive.brand.catchy.active" sx={{
                margin: '16px 0px',
            }}/>) : (<>
          <FlexContainer flexDirection="column" sx={{ marginTop: '16px' }}>
            <Animation height={88} width={88} animationParams={{
                renderer: 'svg',
                animationData: failureLottie,
                loop: false,
                autoplay: true,
            }}/>
            <Paragraph textStyle="ds.body.standard.regular" color="ds.text.danger.quiet" sx={{
                marginTop: '24px',
                marginBottom: '8px',
            }}>
              {translate(error
                ? I18N_ERROR_KEYS_MAPPER[error] ??
                    I18N_ERROR_KEYS_MAPPER['generic']
                : I18N_ERROR_KEYS_MAPPER['generic'])}
            </Paragraph>
          </FlexContainer>
          <Button onClick={handleResendPushNotification} size="large" fullsize sx={{ marginBottom: '8px' }}>
            {translate(I18N_KEYS.BUTTON_SEND_PUSH_NOTIFICATION)}
          </Button>
        </>)}
      <FlexContainer flexDirection="row">
        <Paragraph color="ds.text.neutral.quiet" sx={{ paddingRight: '4px' }}>
          {translate(I18N_KEYS.CANT_ACCESS_APP)}
        </Paragraph>
        <Link target="_blank" rel="noopener noreferrer" onClick={handleSwitchToEmailToken} color="ds.text.brand.standard">
          {translate(I18N_KEYS.SEND_CODE_BY_EMAIL)}
        </Link>
      </FlexContainer>
    </WebappLoginLayout>);
};
