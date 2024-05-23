import { DialogFooter } from '@dashlane/ui-components';
import * as React from 'react';
import { SimpleDialog } from 'libs/dashlane-style/dialogs/simple/simple-dialog';
import useTranslate from 'libs/i18n/useTranslate';
const I18N_KEYS = {
    TITLE: 'webapp_lock_items_confirm_label',
    SUBTITLE: 'webapp_lock_items_confirm_subtitle',
    DISMISS: 'webapp_lock_items_cancel',
};
const CONTINUE_BUTTON_TYPE_KEY_MAP: Record<string, string> = {
    VERIFIED: 'webapp_lock_items_copy',
    COPIED: 'webapp_generic_copy_to_clipboard_feedback_ok',
};
interface Props {
    onDismiss: () => void;
    onSuccess: () => void;
}
export const ProtectedItemsUnlockedDialog = ({ onDismiss, onSuccess, }: Props) => {
    const { translate } = useTranslate();
    return (<SimpleDialog isOpen onRequestClose={onDismiss} footer={<DialogFooter intent="primary" primaryButtonTitle={translate(CONTINUE_BUTTON_TYPE_KEY_MAP.VERIFIED)} primaryButtonOnClick={onSuccess} secondaryButtonTitle={translate(I18N_KEYS.DISMISS)} secondaryButtonOnClick={onDismiss}/>} title={translate(I18N_KEYS.TITLE)}>
      {translate(I18N_KEYS.SUBTITLE)}
    </SimpleDialog>);
};
