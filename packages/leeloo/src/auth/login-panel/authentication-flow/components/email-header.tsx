import { AuthenticationFlowContracts } from '@dashlane/authentication-contracts';
import { Button, jsx, Paragraph } from '@dashlane/design-system';
import { useModuleCommands } from '@dashlane/framework-react';
import { UserUseAnotherAccountEvent } from '@dashlane/hermes';
import useTranslate from 'libs/i18n/useTranslate';
import { logEvent } from 'libs/logs/logEvent';
interface Props {
    selectedEmail?: string;
}
const I18N_KEYS = {
    LOGIN_WITH_A_DIFFERENT_ACCOUNT: 'webapp_login_form_password_fieldset_log_in_different_account',
};
export const EmailHeader = ({ selectedEmail }: Props) => {
    const { translate } = useTranslate();
    const { changeLogin } = useModuleCommands(AuthenticationFlowContracts.authenticationFlowApi);
    const switchAccountEmailDescription = translate(I18N_KEYS.LOGIN_WITH_A_DIFFERENT_ACCOUNT);
    const logUserUseAnotherAccountEvent = () => {
        void logEvent(new UserUseAnotherAccountEvent({}));
    };
    const handleSwitchAccount = () => {
        changeLogin({});
        logUserUseAnotherAccountEvent();
    };
    return (<div>
      <Paragraph sx={{
            fontWeight: 500,
            wordBreak: 'break-all',
            marginBottom: '5px',
        }} data-testid="login-email-header">
        {selectedEmail}
      </Paragraph>
      <Button type="button" intensity="supershy" onClick={() => handleSwitchAccount()} sx={{
            padding: '0',
            height: 'auto',
            fontWeight: '400',
            fontSize: '13px',
            '&:hover': {
                backgroundColor: 'transparent !important',
            },
        }} aria-label={switchAccountEmailDescription}>
        {switchAccountEmailDescription}
      </Button>
    </div>);
};
