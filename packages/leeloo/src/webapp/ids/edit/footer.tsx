import { Button, FlexContainer, jsx, PaperClipIcon, TrashIcon, } from '@dashlane/ui-components';
import useTranslate from 'libs/i18n/useTranslate';
export const ID_EDIT_FOOTER_I18N_KEYS = {
    CANCEL: 'webapp_panel_edition_generic_cancel_changes',
    CLOSE: 'webapp_panel_edition_generic_close',
    DELETE: 'webapp_panel_edition_generic_delete',
    SAVE: 'webapp_panel_edition_generic_save_changes',
};
export interface Props {
    formId: string;
    handleCancel: () => void;
    handleDelete: () => void;
    hasDataBeenModified: boolean;
    isSubmitting: boolean;
    focusAttachmentTab?: () => void;
}
export const IdDocumentEditFooter = ({ formId, handleCancel, handleDelete, hasDataBeenModified, isSubmitting, focusAttachmentTab, }: Props) => {
    const { translate } = useTranslate();
    return (<FlexContainer sx={{ padding: '24px' }} as="footer" justifyContent="flex-start" flexDirection="row" flexWrap="nowrap">
      <Button nature="secondary" onClick={handleDelete} type="button" disabled={isSubmitting} sx={{ marginRight: '16px' }}>
        <TrashIcon />
        {translate(ID_EDIT_FOOTER_I18N_KEYS.DELETE)}
      </Button>
      {!!focusAttachmentTab && (<Button key="attach" nature="secondary" onClick={focusAttachmentTab} type="button">
          <PaperClipIcon />
          {translate('webapp_secure_notes_add_attachment_action_name')}
        </Button>)}
      {hasDataBeenModified ? (<FlexContainer flexDirection="row" flexWrap="nowrap" sx={{ marginLeft: 'auto' }}>
          <Button type="submit" form={formId} disabled={isSubmitting}>
            {translate(ID_EDIT_FOOTER_I18N_KEYS.SAVE)}
          </Button>
          <Button sx={{ marginLeft: '16px' }} nature="secondary" onClick={handleCancel} type="button">
            {translate(ID_EDIT_FOOTER_I18N_KEYS.CANCEL)}
          </Button>
        </FlexContainer>) : (<Button nature="secondary" onClick={handleCancel} type="button" sx={{ marginLeft: 'auto' }}>
          {translate(ID_EDIT_FOOTER_I18N_KEYS.CLOSE)}
        </Button>)}
    </FlexContainer>);
};
