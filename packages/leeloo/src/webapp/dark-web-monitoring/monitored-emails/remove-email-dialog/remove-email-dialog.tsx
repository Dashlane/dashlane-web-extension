import * as React from 'react';
import useTranslate from 'libs/i18n/useTranslate';
import { DialogFooter, Paragraph } from '@dashlane/ui-components';
import { SimpleDialog } from 'libs/dashlane-style/dialogs/simple/simple-dialog';
import styles from './styles.css';
const I18N_KEYS = {
    CANCEL_BUTTON: 'webapp_darkweb_email_removal_cancel_action',
    STOP_MONITORING_BUTTON: 'webapp_darkweb_email_stop_monitoring_action',
    STOP_MONITORING_DIALOG_TITLE: 'webapp_darkweb_email_stop_monitoring_dialog_title',
    STOP_MONITORING_DIALOG_DESCRIPTION: 'webapp_darkweb_email_stop_monitoring_dialog_content_markup',
};
export interface RemoveEmailDialogProps {
    email: string;
    handleOnRemoveEmail: (email: string) => void;
    handleOnCloseDialog: () => void;
}
export const RemoveEmailDialog = ({ email, handleOnRemoveEmail, handleOnCloseDialog, }: RemoveEmailDialogProps) => {
    const { translate } = useTranslate();
    const onRemoveEmail = React.useCallback(() => {
        handleOnRemoveEmail(email);
    }, [email, handleOnRemoveEmail]);
    return (<SimpleDialog isOpen onRequestClose={handleOnCloseDialog} footer={<DialogFooter primaryButtonTitle={translate(I18N_KEYS.STOP_MONITORING_BUTTON)} primaryButtonOnClick={onRemoveEmail} secondaryButtonTitle={translate(I18N_KEYS.CANCEL_BUTTON)} secondaryButtonOnClick={handleOnCloseDialog} intent="danger"/>} title={translate(I18N_KEYS.STOP_MONITORING_DIALOG_TITLE)}>
      <Paragraph className={styles.subtitle}>
        {translate.markup(I18N_KEYS.STOP_MONITORING_DIALOG_DESCRIPTION, {
            email: email,
        })}
      </Paragraph>
    </SimpleDialog>);
};
