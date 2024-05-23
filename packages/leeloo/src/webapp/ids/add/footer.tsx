import { Button, FlexContainer, jsx } from '@dashlane/ui-components';
import useTranslate from 'libs/i18n/useTranslate';
const I18N_KEYS = {
    CANCEL: 'webapp_panel_edition_generic_cancel_changes',
    DELETE: 'webapp_panel_edition_generic_delete',
    SAVE: 'webapp_panel_edition_generic_save_changes',
};
export interface Props {
    formId: string;
    handleCancel: () => void;
    hasDataBeenModified: boolean;
    isSubmitting: boolean;
}
export const IdDocumentAddFooter = ({ formId, handleCancel, hasDataBeenModified, isSubmitting, }: Props) => {
    const { translate } = useTranslate();
    return (<FlexContainer sx={{ padding: '24px' }} as="footer" justifyContent="flex-end" flexDirection="row" flexWrap="nowrap">
      {hasDataBeenModified ? (<Button type="submit" form={formId} disabled={isSubmitting}>
          {translate(I18N_KEYS.SAVE)}
        </Button>) : null}
      <Button sx={{ marginLeft: '16px' }} nature="secondary" onClick={handleCancel} type="button">
        {translate(I18N_KEYS.CANCEL)}
      </Button>
    </FlexContainer>);
};
