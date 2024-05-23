import { Fragment, useEffect, useState } from 'react';
import { Button, colors, FlexContainer, jsx, Link, LoadingIcon, Paragraph, } from '@dashlane/ui-components';
import { AuthenticationCode } from '@dashlane/communication';
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
interface DashlaneAuthenticatorStepProps {
    switchToOtpTokenStep: () => void;
    sendDashlaneAuthenticatorPush: () => void;
    errorKey?: string | undefined;
}
export const DashlaneAuthenticatorStep = ({ switchToOtpTokenStep, sendDashlaneAuthenticatorPush, errorKey = undefined, }: DashlaneAuthenticatorStepProps) => {
    const { translate } = useTranslate();
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
        setIsLoading(!errorKey);
    }, [errorKey]);
    return (<>
      <Paragraph sx={{ fontSize: '32px', fontWeight: 500 }}>
        {translate(I18N_KEYS.DASHLANE_AUTHENTICATOR_TITLE)}
      </Paragraph>
      {isLoading ? (<LoadingIcon data-testid="dashlane-authenticator-loading-icon" sx={{ margin: '24px 0px' }} size="80px" color={colors.dashGreen00}/>) : (<FlexContainer flexDirection="column" sx={{ margin: '24px 0px' }}>
          <Animation height={80} width={80} animationParams={{
                renderer: 'svg',
                animationData: failureLottie,
                loop: false,
                autoplay: true,
            }}/>
          {errorKey ? (<>
              <Paragraph size="small" color={colors.functionalRed02} sx={{ margin: '24px 0px' }}>
                {translate(I18N_ERROR_KEYS_MAPPER[errorKey]
                    ? I18N_ERROR_KEYS_MAPPER[errorKey]
                    : I18N_ERROR_KEYS_MAPPER['generic'])}
              </Paragraph>
              <Button sx={{ alignSelf: 'baseline' }} type="button" nature="primary" onClick={sendDashlaneAuthenticatorPush}>
                {translate(I18N_KEYS.BUTTON_SEND_PUSH_NOTIFICATION)}
              </Button>
            </>) : null}
        </FlexContainer>)}
      <FlexContainer alignItems="center">
        <Paragraph size="small" sx={{ marginRight: '5px' }}>
          {translate(I18N_KEYS.CANT_ACCESS_APP)}
        </Paragraph>
        <Link target="_blank" rel="noopener noreferrer" onClick={switchToOtpTokenStep} color={colors.midGreen00} sx={{ fontSize: '14px' }}>
          {translate(I18N_KEYS.SEND_CODE_BY_EMAIL)}
        </Link>
      </FlexContainer>
    </>);
};
