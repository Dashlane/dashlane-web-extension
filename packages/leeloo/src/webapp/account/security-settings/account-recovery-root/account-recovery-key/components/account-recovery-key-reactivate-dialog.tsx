import { useState } from 'react';
import classnames from 'classnames';
import { Button, jsx } from '@dashlane/design-system';
import { Dialog, DialogBody, DialogFooter, DialogTitle, Heading, KeyIcon, Paragraph, } from '@dashlane/ui-components';
import useTranslate from 'libs/i18n/useTranslate';
import { allIgnoreClickOutsideClassName } from 'webapp/variables';
import { AccountRecoveryKeyActivationContainer } from '../containers/account-recovery-key-activation-container';
interface Props {
    onClose: () => void;
    onGoToRecoveryKeySettings: () => void;
}
const I18N_KEYS = {
    BUTTON_CLOSE_DIALOG: '_common_dialog_dismiss_button',
    TITLE: 'webapp_account_recovery_key_reactivation_title',
    DESCRIPTION: 'webapp_account_recovery_key_reactivation_description',
    CANCEL_BUTTON: '_common_action_cancel',
    GO_TO_SETTINGS_BUTTON: 'webapp_account_recovery_key_reactivation_cta',
};
export const AccountRecoveryKeyReactivateDialog = ({ onClose, onGoToRecoveryKeySettings, }: Props) => {
    const { translate } = useTranslate();
    const [isRecoveryKeyActivationFlowOpen, setIsRecoveryKeyActivationFlowOpen] = useState(false);
    const goToRecoveryKeySettings = () => {
        onGoToRecoveryKeySettings();
        setIsRecoveryKeyActivationFlowOpen(true);
    };
    return isRecoveryKeyActivationFlowOpen ? (<AccountRecoveryKeyActivationContainer onClose={onClose}/>) : (<Dialog isOpen modalContentClassName={classnames(allIgnoreClickOutsideClassName)} disableOutsideClickClose disableScrolling disableUserInputTrap disableEscapeKeyClose closeIconName={translate(I18N_KEYS.BUTTON_CLOSE_DIALOG)} onClose={onClose}>
      <KeyIcon size={77} color="ds.text.brand.quiet" sx={{ margin: '10px 0 30px 0' }}/>
      <DialogTitle>
        <Heading size="small" color="ds.text.neutral.catchy" sx={{ marginBottom: '16px' }}>
          {translate(I18N_KEYS.TITLE)}
        </Heading>
      </DialogTitle>
      <DialogBody>
        <Paragraph>{translate(I18N_KEYS.DESCRIPTION)}</Paragraph>
      </DialogBody>
      <DialogFooter>
        <Button intensity="quiet" mood="neutral" sx={{ marginRight: '8px' }} onClick={onClose}>
          {translate(I18N_KEYS.CANCEL_BUTTON)}
        </Button>
        <Button mood="brand" onClick={goToRecoveryKeySettings}>
          {translate(I18N_KEYS.GO_TO_SETTINGS_BUTTON)}
        </Button>
      </DialogFooter>
    </Dialog>);
};
