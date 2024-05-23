import { jsx } from '@dashlane/design-system';
import { DialogFooter } from '@dashlane/ui-components';
import useTranslate from 'libs/i18n/useTranslate';
import { SimpleDialog } from 'libs/dashlane-style/dialogs/simple/simple-dialog';
import { SimpleDialogHeader } from 'libs/dashlane-style/dialogs/simple/simple-dialog-header';
interface Props {
    onSubmit: (value?: string) => void;
    onClose: () => void;
    collectionName: string;
    itemTitle: string;
}
const I18N_KEYS = {
    TITLE: 'webapp_sharing_add_item_to_shared_collection_dialog_title_markup',
    DESCRIPTION: 'webapp_sharing_add_item_to_shared_collection_dialog_description_markup',
    CONFIRM: 'webapp_login_add_item_to_shared_collection_dialog_confirm_button',
    CANCEL: '_common_action_cancel',
};
export const AddSharedCollectionDialog = ({ onSubmit, onClose, itemTitle, collectionName, }: Props) => {
    const { translate } = useTranslate();
    return (<SimpleDialog onRequestClose={onClose} isOpen disableBackgroundPanelClose disableOutsideClickClose showCloseIcon title={<SimpleDialogHeader>
          {translate.markup(I18N_KEYS.TITLE, {
                itemTitle: itemTitle,
            })}
        </SimpleDialogHeader>} footer={<DialogFooter primaryButtonTitle={translate(I18N_KEYS.CONFIRM)} primaryButtonOnClick={() => onSubmit(collectionName)} secondaryButtonTitle={translate(I18N_KEYS.CANCEL)} secondaryButtonOnClick={onClose} secondaryButtonProps={{ autoFocus: true }}/>}>
      <div sx={{ maxWidth: '480px', padding: 0, margin: 0 }}>
        {translate.markup(I18N_KEYS.DESCRIPTION, {
            collectionName,
        })}
      </div>
    </SimpleDialog>);
};
