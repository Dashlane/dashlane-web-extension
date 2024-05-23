import { DialogFooter } from '@dashlane/ui-components';
import React from 'react';
import useTranslate from 'libs/i18n/useTranslate';
import { SimpleDialog } from 'libs/dashlane-style/dialogs/simple/simple-dialog';
interface LogOutDialogProps {
    isOpen: boolean;
    onDismiss?: () => void;
    onLogout: () => void;
    showCloseIcon: boolean;
}
export const LogOutDialog = ({ isOpen, onLogout, onDismiss, showCloseIcon, }: LogOutDialogProps) => {
    const { translate } = useTranslate();
    const handleOnLogout = () => {
        onLogout();
    };
    const handleOnDismiss = () => {
        if (onDismiss) {
            onDismiss();
        }
    };
    return (<SimpleDialog isOpen={isOpen} onRequestClose={handleOnDismiss} footer={<DialogFooter primaryButtonTitle={translate('webapp_logout_dialog_confirm')} primaryButtonOnClick={handleOnLogout} secondaryButtonTitle={translate('webapp_logout_dialog_dismiss')} secondaryButtonOnClick={handleOnDismiss} intent="danger"/>} title={translate('webapp_logout_dialog_title')} showCloseIcon={showCloseIcon}>
      {translate('webapp_logout_dialog_text')}
    </SimpleDialog>);
};
