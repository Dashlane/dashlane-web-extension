import { Button, FlexContainer, Heading, jsx, Paragraph, } from '@dashlane/ui-components';
import useTranslate from 'libs/i18n/useTranslate';
import { openExternalUrl, PASSWORD_LESS_HELP_ARTICLE, } from 'src/libs/externalUrls';
const I18N_KEYS = {
    TITLE: 'login/password_less_title',
    DESCRIPTION: 'login/password_less_description',
    CONFIRM_BUTTON: 'login/password_less_confirm_button',
    HELP_BUTTON: 'login/password_less_help_button',
};
interface PasswordLessStepProps {
    switchToEmailStep: () => void;
}
export const PasswordLessStep = ({ switchToEmailStep, }: PasswordLessStepProps) => {
    const { translate } = useTranslate();
    return (<FlexContainer flexDirection="column" sx={{
            padding: '24px',
            height: '100%',
        }} alignItems="center">
      <Heading size="small" sx={{ color: 'white' }}>
        {translate(I18N_KEYS.TITLE)}
      </Heading>

      <Paragraph sx={{ marginTop: '16px', flexGrow: '1', color: 'white' }}>
        {translate(I18N_KEYS.DESCRIPTION)}
      </Paragraph>

      <Button type="button" nature="primary" size="large" theme="dark" onClick={switchToEmailStep} sx={{ marginBottom: '8px', width: '100%' }}>
        {translate(I18N_KEYS.CONFIRM_BUTTON)}
      </Button>

      <Button onClick={() => {
            void openExternalUrl(PASSWORD_LESS_HELP_ARTICLE);
        }} type="button" nature="secondary" theme="dark" size="large" sx={{ width: '100%' }}>
        {translate(I18N_KEYS.HELP_BUTTON)}
      </Button>
    </FlexContainer>);
};
