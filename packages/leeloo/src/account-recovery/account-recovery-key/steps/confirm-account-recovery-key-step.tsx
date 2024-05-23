import { Fragment, useEffect } from 'react';
import { SubmitRecoveryKeyRequest } from '@dashlane/account-recovery-contracts';
import { Button, Heading, Paragraph } from '@dashlane/design-system';
import { useAnalyticsCommands } from '@dashlane/framework-react';
import { Result } from '@dashlane/framework-types';
import { FlowStep, PageView, UserUseAccountRecoveryKeyEvent, } from '@dashlane/hermes';
import { FlexChild, FlexContainer, jsx, KeyIcon, } from '@dashlane/ui-components';
import useTranslate from 'libs/i18n/useTranslate';
import { AccountRecoveryKeyInput } from 'webapp/account/security-settings/account-recovery-root/account-recovery-key/components/account-recovery-key-input';
import { useAccountRecoveryKeyInputRecoveryFlow } from 'account-recovery/hooks/use-account-recovery-key-input-recovery-flow';
import { redirect, useRouterGlobalSettingsContext } from 'libs/router';
import { logEvent } from 'libs/logs/logEvent';
import { ACCOUNT_RECOVERY_KEY_RESULT_SEGMENT, LOGIN_URL_SEGMENT, } from 'app/routes/constants';
import { registerRedirectPath } from 'libs/redirect/after-login/actions';
const I18N_KEYS = {
    ACCOUNT_RECOVERY_STEP_COUNT: 'login_confirm_account_recovery_key_step_count',
    CONFIRM_ARK_STEP_TITLE: 'login_confirm_account_recovery_key_step_title',
    CONFIRM_ARK_STEP_DESCRIPTION: 'login_confirm_account_recovery_key_step_description',
    CONFIRM_ARK_STEP_INPUT_LABEL: 'webapp_account_recovery_key_input_label',
    CONFIRM_ARK_STEP_INPUT_PLACEHOLDER: 'webapp_account_recovery_key_input_placeholder',
    CONFIRM_ARK_STEP_CANCEL: '_common_action_cancel',
    CONFIRM_ARK_STEP_CONTINUE: '_common_action_continue',
    WRONG_RECOVERY_KEY_ERROR: 'webapp_account_recovery_key_third_step_wrong_key_error',
    GENERIC_ERROR: '_common_generic_error',
};
interface Props {
    onSubmit: (command: SubmitRecoveryKeyRequest) => Promise<Result<undefined>>;
    onCancel: () => Promise<Result<undefined>>;
    error?: string;
    accountType?: string;
}
export const ConfirmAccountRecoveryKeyStep = ({ onSubmit, onCancel, error, accountType, }: Props) => {
    const { translate } = useTranslate();
    const { trackPageView } = useAnalyticsCommands();
    const routerGlobalSettings = useRouterGlobalSettingsContext();
    useEffect(() => {
        trackPageView({
            pageView: PageView.LoginMasterPasswordAccountRecoveryEnterRecoveryKey,
        });
    }, []);
    const { inputValue, isInputValid, handleChangeInputValue } = useAccountRecoveryKeyInputRecoveryFlow();
    const handleCancel = () => {
        onCancel();
        logEvent(new UserUseAccountRecoveryKeyEvent({ flowStep: FlowStep.Cancel }));
        redirect(LOGIN_URL_SEGMENT);
    };
    const handleSubmit = () => {
        if (accountType === 'invisibleMasterPassword') {
            routerGlobalSettings.store.dispatch(registerRedirectPath(ACCOUNT_RECOVERY_KEY_RESULT_SEGMENT));
        }
        onSubmit({ recoveryKey: inputValue });
    };
    return (<>
      <KeyIcon size={77} color="ds.text.brand.quiet" sx={{ margin: '0px 0 53px 12px' }}/>
      <Paragraph color="ds.text.neutral.quiet" sx={{ marginBottom: '8px' }}>
        {translate(I18N_KEYS.ACCOUNT_RECOVERY_STEP_COUNT, {
            count: 1,
            total: 2,
        })}
      </Paragraph>
      <Heading as="h1" textStyle="ds.title.section.large" sx={{ margin: '0 0 24px 0' }}>
        {translate(I18N_KEYS.CONFIRM_ARK_STEP_TITLE)}
      </Heading>
      <Paragraph sx={{ marginBottom: '34px' }}>
        {translate(I18N_KEYS.CONFIRM_ARK_STEP_DESCRIPTION)}
      </Paragraph>
      <FlexChild sx={{ width: '100%', marginBottom: '36px' }}>
        <AccountRecoveryKeyInput value={inputValue} onChange={handleChangeInputValue} error={error && translate(I18N_KEYS[error ?? 'GENERIC_ERROR'])}/>
      </FlexChild>
      <FlexContainer justifyContent="flex-end" sx={{ width: '100%' }} flexDirection="row">
        <Button intensity="quiet" mood="neutral" sx={{ marginRight: '8px' }} onClick={handleCancel}>
          {translate(I18N_KEYS.CONFIRM_ARK_STEP_CANCEL)}
        </Button>
        <Button mood="brand" disabled={!isInputValid} onClick={handleSubmit}>
          {translate(I18N_KEYS.CONFIRM_ARK_STEP_CONTINUE)}
        </Button>
      </FlexContainer>
    </>);
};
