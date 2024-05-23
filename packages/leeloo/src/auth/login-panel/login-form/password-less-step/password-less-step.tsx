import { Fragment } from 'react';
import { Button, FlexContainer, Heading, jsx, Paragraph, } from '@dashlane/ui-components';
import useTranslate from 'libs/i18n/useTranslate';
import { redirectToUrl } from 'libs/external-urls';
import { PASSWORD_LESS_HELP_ARTICLE } from 'webapp/urls';
interface PasswordLessStepProps {
    switchToEmailStep: () => void;
}
export const I18N_KEYS = {
    BUTTON_HELP: 'webapp_login_form_password_less_help_button',
    BUTTON_CONFIRM: 'webapp_login_form_password_less_confirm_button',
    DESCRIPTION: 'webapp_login_form_password_less_description',
    TITLE: 'webapp_login_form_password_less_title',
};
export const PasswordLessStep = ({ switchToEmailStep, }: PasswordLessStepProps) => {
    const { translate } = useTranslate();
    return (<>
      <Heading>{translate(I18N_KEYS.TITLE)}</Heading>

      <Paragraph color="neutrals.8" sx={{ margin: '12px 0px 32px 0px' }}>
        {translate(I18N_KEYS.DESCRIPTION)}
      </Paragraph>
      <FlexContainer flexDirection="column" gap="8px">
        <Button nature="primary" type="button" onClick={switchToEmailStep}>
          {translate(I18N_KEYS.BUTTON_CONFIRM)}
        </Button>

        <Button nature="secondary" type="button" onClick={() => redirectToUrl(PASSWORD_LESS_HELP_ARTICLE)}>
          {translate(I18N_KEYS.BUTTON_HELP)}
        </Button>
      </FlexContainer>
    </>);
};
