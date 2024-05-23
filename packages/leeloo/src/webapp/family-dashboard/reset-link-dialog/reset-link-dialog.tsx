import * as React from 'react';
import { DialogFooter } from '@dashlane/ui-components';
import useTranslate from 'libs/i18n/useTranslate';
import { SimpleDialog } from 'libs/dashlane-style/dialogs/simple/simple-dialog';
const I18N_KEYS = {
    DIALOG_TITLE: 'webapp_family_dashboard_reset_link_dialog_title',
    DIALOG_DESCRIPTION: 'webapp_family_dashboard_reset_link_dialog_description',
    CANCEL_BUTTON: 'webapp_family_dashboard_reset_link_dialog_button_cancel',
    CONFIRM_BUTTON: 'webapp_family_dashboard_reset_link_dialog_button_confirm',
};
export interface ResetLinkDialogProps {
    handleResetLink: () => void;
    handleOnCancel: () => void;
}
export const ResetLinkDialog = ({ handleResetLink, handleOnCancel, }: ResetLinkDialogProps) => {
    const { translate } = useTranslate();
    return (<SimpleDialog isOpen onRequestClose={handleOnCancel} showCloseIcon footer={<DialogFooter primaryButtonTitle={translate(I18N_KEYS.CONFIRM_BUTTON)} primaryButtonOnClick={handleResetLink} secondaryButtonTitle={translate(I18N_KEYS.CANCEL_BUTTON)} secondaryButtonOnClick={handleOnCancel} intent="danger"/>} title={translate(I18N_KEYS.DIALOG_TITLE)}>
      {translate(I18N_KEYS.DIALOG_DESCRIPTION)}
    </SimpleDialog>);
};
