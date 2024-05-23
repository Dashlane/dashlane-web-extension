import classnames from 'classnames';
import { accountRecoveryKeyApi } from '@dashlane/account-recovery-contracts';
import { AuthenticationFlowContracts } from '@dashlane/authentication-contracts';
import { Button, Heading, Icon, Paragraph } from '@dashlane/design-system';
import { FlowStep, UserUseAccountRecoveryKeyEvent } from '@dashlane/hermes';
import { useModuleCommands, useModuleQuery } from '@dashlane/framework-react';
import { Dialog, DialogBody, DialogFooter, DialogTitle, jsx, KeyIcon, Link, } from '@dashlane/ui-components';
import { logEvent } from 'libs/logs/logEvent';
import useTranslate from 'libs/i18n/useTranslate';
import { allIgnoreClickOutsideClassName } from 'webapp/variables';
import { ACCOUNT_RECOVERY_KEY_URL_SEGMENT, ADMIN_ASSISTED_RECOVERY_URL_SEGMENT, HELPCENTER_ACCOUNT_RECOVERY_URL, } from 'app/routes/constants';
import { redirect } from 'libs/router';
const I18N_KEYS = {
    CHOOSE_ACCOUNT_RECOVERY_METHOD_TITLE: 'webapp_login_form_choose_account_recovery_key_method_title',
    CHOOSE_ACCOUNT_RECOVERY_METHOD_DESCRIPTION: 'webapp_login_form_choose_account_recovery_key_method_description',
    CHOOSE_ACCOUNT_RECOVERY_METHOD_LINK: 'webapp_login_form_choose_account_recovery_key_method_link',
    BUTTON_USE_RECOVERY_KEY: 'webapp_login_form_choose_account_recovery_key_method_use_ark_button',
    BUTTON_USE_ADMIN_ASSISTED_RECOVERY: 'webapp_login_form_choose_account_recovery_key_method_use_admin_ar_button',
    BUTTON_CLOSE_DIALOG: '_common_dialog_dismiss_button',
};
interface Props {
    onClose: () => void;
}
export const ChooseAccountRecoveryMethodDialog = ({ onClose }: Props) => {
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
    return (<Dialog isOpen={true} modalContentClassName={classnames(allIgnoreClickOutsideClassName)} disableOutsideClickClose disableScrolling disableUserInputTrap disableEscapeKeyClose closeIconName={translate(I18N_KEYS.BUTTON_CLOSE_DIALOG)} onClose={onClose}>
      <KeyIcon size={77} color="ds.text.brand.quiet" sx={{ margin: '10px 0 30px 0' }}/>
      <DialogTitle>
        <Heading as="h2" color="ds.text.neutral.catchy" sx={{ marginBottom: '16px' }}>
          {translate(I18N_KEYS.CHOOSE_ACCOUNT_RECOVERY_METHOD_TITLE)}
        </Heading>
      </DialogTitle>
      <DialogBody>
        <Paragraph color="ds.text.neutral.standard">
          {translate(I18N_KEYS.CHOOSE_ACCOUNT_RECOVERY_METHOD_DESCRIPTION)}
        </Paragraph>
        <Link target="_blank" rel="noopener noreferrer" href={HELPCENTER_ACCOUNT_RECOVERY_URL} sx={{ display: 'flex', alignItems: 'center', marginTop: '16px' }}>
          <Paragraph color="ds.text.brand.quiet" textStyle="ds.body.standard.strong" sx={{ marginRight: '6px' }}>
            {translate(I18N_KEYS.CHOOSE_ACCOUNT_RECOVERY_METHOD_LINK)}
          </Paragraph>
          <Icon name="ActionOpenExternalLinkOutlined" size="small" color="ds.text.brand.standard"/>
        </Link>
      </DialogBody>
      <DialogFooter>
        <Button intensity="quiet" mood="neutral" sx={{ marginRight: '8px' }} onClick={handleStartRecoveryFlow}>
          {translate(I18N_KEYS.BUTTON_USE_RECOVERY_KEY)}
        </Button>
        <Button mood="brand" onClick={() => {
            redirect(ADMIN_ASSISTED_RECOVERY_URL_SEGMENT);
        }}>
          {translate(I18N_KEYS.BUTTON_USE_ADMIN_ASSISTED_RECOVERY)}
        </Button>
      </DialogFooter>
    </Dialog>);
};
