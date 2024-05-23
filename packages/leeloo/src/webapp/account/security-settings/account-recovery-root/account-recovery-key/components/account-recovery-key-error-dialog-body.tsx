import { Fragment, useEffect } from 'react';
import { ActivationFlowErrorView } from '@dashlane/account-recovery-contracts';
import { Button } from '@dashlane/design-system';
import { CreateKeyErrorName, FlowStep, UserCreateAccountRecoveryKeyEvent, } from '@dashlane/hermes';
import { colors, CrossCircleIcon, DialogBody, DialogFooter, DialogTitle, Heading, jsx, Paragraph, } from '@dashlane/ui-components';
import useTranslate from 'libs/i18n/useTranslate';
import { logEvent } from 'libs/logs/logEvent';
export const I18N_KEYS = {
    GENERIC_ERROR: 'webapp_account_recovery_key_activation_generic_error_title',
    GENERIC_ERROR_DESC: 'webapp_account_recovery_key_activation_generic_error_desc',
    GENERIC_ERROR_BUTTON: '_common_dialog_done_button',
    NETWORK_ERROR: 'webapp_account_recovery_key_activation_network_error_title',
    NETWORK_ERROR_DESC: 'webapp_account_recovery_key_activation_network_error_desc',
    NETWORK_ERROR_BUTTON: 'webapp_account_recovery_key_activation_network_error_button',
};
export interface AccountRecoveryKeyErrorDialogBodyProps extends Pick<ActivationFlowErrorView, 'error'> {
    onClose: () => void;
}
export const AccountRecoveryKeyErrorDialogBody = ({ error, onClose, }: AccountRecoveryKeyErrorDialogBodyProps) => {
    const { translate } = useTranslate();
    useEffect(() => {
        if (error === 'GENERIC_ERROR') {
            void logEvent(new UserCreateAccountRecoveryKeyEvent({
                flowStep: FlowStep.Error,
                createKeyErrorName: CreateKeyErrorName.Unknown,
            }));
        }
    }, [error]);
    return (<>
      <CrossCircleIcon size={77} color={colors.functionalRed02} sx={{ margin: '10px 0 30px -10px' }}/>
      <DialogTitle>
        <Heading size="small" color="ds.text.neutral.catchy" sx={{ marginBottom: '16px' }}>
          {translate(I18N_KEYS[error ?? ''])}
        </Heading>
      </DialogTitle>
      <DialogBody>
        <Paragraph color={colors.dashGreen01}>
          {translate(I18N_KEYS[`${error}_DESC`])}
        </Paragraph>
      </DialogBody>
      <DialogFooter>
        <Button mood="brand" onClick={onClose}>
          {translate(I18N_KEYS[`${error}_BUTTON`])}
        </Button>
      </DialogFooter>
    </>);
};
