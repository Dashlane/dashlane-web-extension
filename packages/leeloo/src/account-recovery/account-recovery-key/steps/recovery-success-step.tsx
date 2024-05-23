import { useEffect } from 'react';
import { Button, Heading, Icon, jsx, Paragraph } from '@dashlane/design-system';
import { useAnalyticsCommands } from '@dashlane/framework-react';
import { DeleteKeyReason, FlowStep, PageView, UserUseAccountRecoveryKeyEvent, } from '@dashlane/hermes';
import { FlexContainer } from '@dashlane/ui-components';
import { ACCOUNT_RECOVERY_KEY_REACTIVATE_SETTINGS } from 'app/routes/constants';
import useTranslate from 'libs/i18n/useTranslate';
import { useHistory } from 'libs/router';
import { logEvent } from 'libs/logs/logEvent';
import { logUserDeleteAccountRecoveryKey } from 'webapp/account/security-settings/account-recovery-root/account-recovery-key/helpers/logs';
const I18N_KEYS = {
    TITLE: 'login_account_recovery_key_success_screen_title',
    DESCRIPTION: 'login_account_recovery_key_success_screen_description',
    CONFIRM_BUTTON: '_common_dialog_done_button',
};
export const RecoverySuccessStep = () => {
    const { translate } = useTranslate();
    const history = useHistory();
    const { trackPageView } = useAnalyticsCommands();
    useEffect(() => {
        trackPageView({
            pageView: PageView.LoginMasterPasswordAccountRecoverySuccess,
        });
    }, []);
    useEffect(() => {
        logEvent(new UserUseAccountRecoveryKeyEvent({
            flowStep: FlowStep.Complete,
        }));
        logUserDeleteAccountRecoveryKey(DeleteKeyReason.RecoveryKeyUsed);
    }, []);
    const handleRedirectToVault = () => {
        history.push(ACCOUNT_RECOVERY_KEY_REACTIVATE_SETTINGS);
    };
    return (<FlexContainer sx={{
            flexDirection: 'column',
            margin: '0 auto',
            textAlign: 'center',
            alignItems: 'center',
        }}>
      <Icon name="FeedbackSuccessOutlined" color="ds.text.brand.quiet" sx={{ marginBottom: '48px', width: '62px', height: '62px' }}/>

      <Heading as="h1" textStyle="ds.title.section.large" sx={{ marginBottom: '16px' }}>
        {translate(I18N_KEYS.TITLE)}
      </Heading>
      <Paragraph as="label" textStyle="ds.body.standard.regular" sx={{ marginBottom: '48px' }}>
        {translate(I18N_KEYS.DESCRIPTION)}
      </Paragraph>
      <Button onClick={handleRedirectToVault}>
        {translate(I18N_KEYS.CONFIRM_BUTTON)}
      </Button>
    </FlexContainer>);
};
