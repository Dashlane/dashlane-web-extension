import React, { useState } from 'react';
import classnames from 'classnames';
import { Dialog } from '@dashlane/ui-components';
import useTranslate from 'libs/i18n/useTranslate';
import { allIgnoreClickOutsideClassName } from 'webapp/variables';
import { UseRecoveryKeyDialogContent } from './use-recovery-key-dialog-content';
import { LostRecoveryKeyDialogContent } from './lost-recovery-key-dialog-content';
const I18N_KEYS = {
    BUTTON_CLOSE_DIALOG: '_common_dialog_dismiss_button',
};
interface Props {
    onClose: () => void;
}
export const AccountRecoveryWithKeyDialog = ({ onClose }: Props) => {
    const { translate } = useTranslate();
    const [userLostKey, setUserLostKey] = useState(false);
    return (<Dialog isOpen modalContentClassName={classnames(allIgnoreClickOutsideClassName)} disableOutsideClickClose disableScrolling disableUserInputTrap disableEscapeKeyClose closeIconName={translate(I18N_KEYS.BUTTON_CLOSE_DIALOG)} onClose={onClose}>
      {!userLostKey ? (<UseRecoveryKeyDialogContent onLostKey={() => setUserLostKey(true)}/>) : (<LostRecoveryKeyDialogContent />)}
    </Dialog>);
};
