import { Fragment, useEffect, useState } from 'react';
import { AuthenticationFlowContracts } from '@dashlane/authentication-contracts';
import { AuthenticationCode } from '@dashlane/communication';
import { Button, jsx } from '@dashlane/design-system';
import { useAnalyticsCommands } from '@dashlane/framework-react';
import { Result } from '@dashlane/framework-types';
import { PageView } from '@dashlane/hermes';
import { CrossCircleIcon, FlexChild, FlexContainer, LoadingIcon, Paragraph, } from '@dashlane/ui-components';
import useTranslate from 'libs/i18n/useTranslate';
import { useCarbonDeathListener } from '../hooks/use-carbon-death-listener';
const I18N_ERROR_KEYS_MAPPER = {
    generic: 'popup_common_generic_error',
    [AuthenticationCode[AuthenticationCode.DASHLANE_AUTHENTICATOR_PUSH_NOTIFICATION_DENIED]]: 'login/dashlane_authenticator_error_denied',
    [AuthenticationCode[AuthenticationCode.TOKEN_EXPIRED]]: 'login/dashlane_authenticator_error_timeout',
};
const I18N_KEYS = {
    DASHLANE_AUTHENTICATOR_TITLE: 'login/dashlane_authenticator_title',
    SEND_CODE_BY_EMAIL: 'login/dashlane_authenticator_send_code_by_email_button',
    BUTTON_SEND_PUSH_NOTIFICATION: 'login/dashlane_authenticator_send_another_push_button',
};
interface Props extends Omit<AuthenticationFlowContracts.AuthenticationFlowDashlaneAuthenticatorView, 'step'> {
    resendPushNotification: () => Promise<Result<undefined>>;
    switchToEmailToken: () => Promise<Result<undefined>>;
}
export const DashlaneAuthenticator = ({ isLoading, error, resendPushNotification, switchToEmailToken, }: Props) => {
    const { translate } = useTranslate();
    const [isCarbonActive, setIsCarbonActive] = useState(true);
    const { trackPageView } = useAnalyticsCommands();
    useEffect(() => {
        void trackPageView({
            pageView: PageView.LoginTokenAuthenticator,
        });
    }, []);
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
    return (<FlexContainer flexDirection="column" sx={{
            flexGrow: '1',
            marginTop: '144px',
            alignItems: 'center',
            padding: '0 24px 24px',
        }}>
      <Paragraph color="ds.text.neutral.catchy" sx={{
            fontSize: '21px',
            fontWeight: 500,
            textAlign: 'center',
        }}>
        {translate(I18N_KEYS.DASHLANE_AUTHENTICATOR_TITLE)}
      </Paragraph>
      {!error && isCarbonActive ? (<LoadingIcon data-testid="dashlane-authenticator-loading-icon" size="80px" sx={{ marginTop: '29px', marginBottom: '21px' }} color="ds.container.expressive.brand.catchy.idle"/>) : (<>
          <CrossCircleIcon size={80} color="ds.container.expressive.danger.catchy.idle" sx={{
                marginTop: '29px',
                marginBottom: '21px',
            }} data-testid="dashlane-authenticator-error-icon"/>
          <Paragraph color="ds.text.neutral.catchy">
            {translate(error
                ? I18N_ERROR_KEYS_MAPPER[error] ??
                    I18N_ERROR_KEYS_MAPPER['generic']
                : I18N_ERROR_KEYS_MAPPER['generic'])}
          </Paragraph>
        </>)}
      <FlexChild sx={{ marginTop: 'auto', width: '100%' }}>
        <Button onClick={handleResendPushNotification} isLoading={isLoading} fullsize size="large" sx={{ marginBottom: '8px' }}>
          {translate(I18N_KEYS.BUTTON_SEND_PUSH_NOTIFICATION)}
        </Button>
        <Button onClick={handleSwitchToEmailToken} mood="neutral" intensity="quiet" fullsize size="large">
          {translate(I18N_KEYS.SEND_CODE_BY_EMAIL)}
        </Button>
      </FlexChild>
    </FlexContainer>);
};
