import { Fragment, useEffect } from 'react';
import { ActivationFlowConfirmKeyView } from '@dashlane/account-recovery-contracts';
import { Button } from '@dashlane/design-system';
import { Result } from '@dashlane/framework-types';
import { useAnalyticsCommands } from '@dashlane/framework-react';
import { PageView } from '@dashlane/hermes';
import { DialogBody, DialogFooter, DialogTitle, Heading, jsx, KeyIcon, Paragraph, } from '@dashlane/ui-components';
import useTranslate from 'libs/i18n/useTranslate';
import { useAccountRecoveryKeyInputActivationFlow } from 'webapp/account/security-settings/hooks/use-account-recovery-key-input-activation-flow';
import { AccountRecoveryKeyInput } from './account-recovery-key-input';
const I18N_KEYS = {
    ARK_ACTIVATION_DISPLAY_KEY_STEP_TITLE: 'webapp_account_recovery_key_third_step_title',
    ARK_ACTIVATION_DISPLAY_KEY_STEP_DESCRIPTION: 'webapp_account_recovery_key_third_step_description',
    ARK_ACTIVATION_DISPLAY_KEY_STEP_INPUT_LABEL: 'webapp_account_recovery_key_input_label',
    ARK_ACTIVATION_DISPLAY_KEY_STEP_INPUT_PLACEHOLDER: 'webapp_account_recovery_key_input_placeholder',
    ARK_ACTIVATION_DISPLAY_KEY_STEP_GO_BACK: '_common_action_go_back',
    ARK_ACTIVATION_DISPLAY_KEY_STEP_CONTINUE: '_common_action_continue',
};
interface Props extends Pick<ActivationFlowConfirmKeyView, 'recoveryKey'> {
    goToNextStep: () => Promise<Result<undefined>>;
    goToPrevStep: () => Promise<Result<undefined>>;
    isLoading: boolean;
}
export const AccountRecoveryKeyActivationConfirmKeyStep = ({ recoveryKey, isLoading, goToNextStep, goToPrevStep, }: Props) => {
    const { translate } = useTranslate();
    const { trackPageView } = useAnalyticsCommands();
    useEffect(() => {
        trackPageView({
            pageView: PageView.SettingsSecurityRecoveryKeyConfirm,
        });
    }, []);
    const { inputValue, inputError, isInputValid, handleChangeInputValue } = useAccountRecoveryKeyInputActivationFlow(recoveryKey ?? '');
    return (<>
      <KeyIcon size={77} color="ds.text.brand.quiet" sx={{ margin: '10px 0 30px 0' }}/>
      <DialogTitle>
        <Heading size="small" color="ds.text.neutral.catchy" sx={{ marginBottom: '16px' }}>
          {translate(I18N_KEYS.ARK_ACTIVATION_DISPLAY_KEY_STEP_TITLE)}
        </Heading>
      </DialogTitle>
      <DialogBody>
        <Paragraph sx={{ marginBottom: '26px' }}>
          {translate(I18N_KEYS.ARK_ACTIVATION_DISPLAY_KEY_STEP_DESCRIPTION)}
        </Paragraph>
        <AccountRecoveryKeyInput value={inputValue} onChange={handleChangeInputValue} error={inputError}/>
      </DialogBody>
      <DialogFooter>
        <Button intensity="quiet" mood="neutral" sx={{ marginRight: '8px' }} onClick={() => {
            void goToPrevStep();
        }}>
          {translate(I18N_KEYS.ARK_ACTIVATION_DISPLAY_KEY_STEP_GO_BACK)}
        </Button>
        <Button mood="brand" isLoading={isLoading} disabled={!isInputValid} onClick={() => {
            void goToNextStep();
        }}>
          {translate(I18N_KEYS.ARK_ACTIVATION_DISPLAY_KEY_STEP_CONTINUE)}
        </Button>
      </DialogFooter>
    </>);
};
