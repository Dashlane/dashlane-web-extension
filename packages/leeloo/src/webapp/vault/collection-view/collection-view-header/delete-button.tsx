import React, { useState } from 'react';
import { Icon } from '@dashlane/design-system';
import useTranslate from 'libs/i18n/useTranslate';
import { VaultHeaderButton } from 'webapp/components/header/vault-header-button';
import { useCollectionPermissionsForUser } from 'webapp/sharing-invite/hooks/use-collection-permissions';
import { DeleteDialog } from '../dialogs';
interface Props {
    id: string;
    isShared: boolean;
    name: string;
    setIsSharedAccessDialogOpen: (value: boolean) => void;
}
export const DeleteButton = (props: Props) => {
    const { translate } = useTranslate();
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const { canDelete } = useCollectionPermissionsForUser(props.id);
    return (<>
      <VaultHeaderButton disabled={!canDelete} onClick={() => setIsDeleteDialogOpen(true)} icon={<Icon name="ActionDeleteOutlined"/>}>
        {translate('collections_delete_button_text')}
      </VaultHeaderButton>
      <DeleteDialog isOpen={isDeleteDialogOpen} onClose={() => setIsDeleteDialogOpen(false)} {...props}/>
    </>);
};
