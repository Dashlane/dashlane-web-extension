import { Button, jsx } from '@dashlane/design-system';
import useTranslate from 'libs/i18n/useTranslate';
import { useEffect } from 'react';
import { useBulkDeletion } from '../../bulk-deletion';
import { useMultiselectContext, useMultiselectUpdateContext, } from '../multi-select-context';
import { DeleteAction } from './delete-action';
import { MenuRow } from './menu-row';
const I18N_KEYS = {
    SELECTED_LOGINS: 'webapp_credentials_multiselect_selected_count',
    CANCEL_BUTTON: 'webapp_credentials_multiselect_menu_close_button',
};
export const MultiSelectMenu = () => {
    const { translate } = useTranslate();
    const { selectedItems } = useMultiselectContext();
    const { clearSelection } = useMultiselectUpdateContext();
    const { openBulkDeletionDialog } = useBulkDeletion();
    const selectedItemsLength = selectedItems.length;
    const deleteSelected = () => {
        openBulkDeletionDialog(selectedItems, clearSelection);
    };
    useEffect(() => {
        const deleteKeyHandler = (event: KeyboardEvent) => {
            const { key } = event;
            if ((key === 'Backspace' || key === 'Delete') &&
                selectedItemsLength > 0) {
                deleteSelected();
            }
        };
        document.addEventListener('keydown', deleteKeyHandler);
        return () => {
            document.removeEventListener('keydown', deleteKeyHandler);
        };
    }, [selectedItemsLength]);
    return (<MenuRow visible={selectedItemsLength > 0}>
      <span>
        {translate(I18N_KEYS.SELECTED_LOGINS, {
            count: selectedItemsLength || 1,
        })}
      </span>
      <ul sx={{
            display: 'flex',
            gap: '16px',
            alignItems: 'center',
            marginLeft: 'auto',
        }}>
        <li>
          <DeleteAction onClick={deleteSelected}/>
        </li>
        <li>
          <Button size="small" mood="neutral" intensity="quiet" icon="ActionCloseOutlined" tooltip={translate(I18N_KEYS.CANCEL_BUTTON)} layout="iconOnly" onClick={clearSelection} data-testid="closeButton"/>
        </li>
      </ul>
    </MenuRow>);
};
