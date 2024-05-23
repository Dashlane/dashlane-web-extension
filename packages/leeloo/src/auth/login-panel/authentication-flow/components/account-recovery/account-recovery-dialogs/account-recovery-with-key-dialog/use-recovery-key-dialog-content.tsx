import { Fragment } from 'react';
import { accountRecoveryKeyApi } from '@dashlane/account-recovery-contracts';
import { AuthenticationFlowContracts } from '@dashlane/authentication-contracts';
import { Button, Heading, jsx, Paragraph } from '@dashlane/design-system';
import { useModuleCommands, useModuleQuery } from '@dashlane/framework-react';
import { FlowStep, UserUseAccountRecoveryKeyEvent } from '@dashlane/hermes';
import { DialogBody, DialogFooter, DialogTitle, KeyIcon, } from '@dashlane/ui-components';
import { ACCOUNT_RECOVERY_KEY_URL_SEGMENT } from 'app/routes/constants';
import { logEvent } from 'libs/logs/logEvent';
import useTranslate from 'libs/i18n/useTranslate';
import { redirect } from 'libs/router';
const I18N_KEYS = {
    USE_YOUR_RECOVERY_KEY_TITLE: 'webapp_login_form_use_your_recovery_key_title',
    USE_YOUR_RECOVERY_KEY_DESCRIPTION: 'webapp_login_form_use_your_recovery_key_description',
    BUTTON_LOST_YOUR_KEY: 'webapp_login_form_use_your_recovery_key_lost_key_button',
    BUTTON_START_RECOVERY: 'webapp_login_form_use_your_recovery_key_start_button',
};
interface Props {
    onLostKey: () => void;
}
export const UseRecoveryKeyDialogContent = ({ onLostKey }: Props) => {
    const { translate } = useTranslate();
    const { startRecoveryFlow } = useModuleCommands(accountRecoveryKeyApi);
    const authenticationFlowStatus = useModuleQuery(AuthenticationFlowContracts.authenticationFlowApi, 'authenticationFlowStatus');
    const handleStartRecoveryFlow = () => {
        if (authenticationFlowStatus.data?.step !== 'MasterPasswordStep') {
            throw new Error('Cant perform AR outside of Master Password step of the Login flow');
        }
        void startRecoveryFlow({
            login: authenticationFlowStatus.data?.loginEmail,
        });
        logEvent(new UserUseAccountRecoveryKeyEvent({ flowStep: FlowStep.Start }));
        redirect(ACCOUNT_RECOVERY_KEY_URL_SEGMENT);
    };
    return (<>
      <KeyIcon size={77} color="ds.text.brand.quiet" sx={{ margin: '10px 0 30px 0' }}/>
      <DialogTitle>
        <Heading as="h2" color="ds.text.neutral.catchy" sx={{ marginBottom: '16px' }}>
          {translate(I18N_KEYS.USE_YOUR_RECOVERY_KEY_TITLE)}
        </Heading>
      </DialogTitle>
      <DialogBody>
        <Paragraph color="ds.text.neutral.standard">
          {translate(I18N_KEYS.USE_YOUR_RECOVERY_KEY_DESCRIPTION)}
        </Paragraph>
      </DialogBody>
      <DialogFooter>
        <Button intensity="quiet" mood="neutral" sx={{ marginRight: '8px' }} onClick={onLostKey}>
          {translate(I18N_KEYS.BUTTON_LOST_YOUR_KEY)}
        </Button>
        <Button onClick={handleStartRecoveryFlow}>
          {translate(I18N_KEYS.BUTTON_START_RECOVERY)}
        </Button>
      </DialogFooter>
    </>);
};
