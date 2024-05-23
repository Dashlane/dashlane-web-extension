import React, { MouseEvent } from 'react';
import { IndeterminateLoader } from '@dashlane/design-system';
import { useModuleCommands } from '@dashlane/framework-react';
import { sharingCollectionsApi } from '@dashlane/sharing-contracts';
import { vaultOrganizationApi } from '@dashlane/vault-contracts';
import useTranslate from 'libs/i18n/useTranslate';
import { useCollectionUsersAndGroupsData } from 'libs/hooks/use-collection-users-and-groups';
import { useLoadingCommandWithAlert } from '../../use-loading-command-with-alert';
import { BaseDialog, BaseDialogProps } from './base-dialog';
interface Props extends BaseDialogProps {
    id: string;
    isShared?: boolean;
    name: string;
    setIsSharedAccessDialogOpen: (value?: boolean) => void;
}
export const DeleteDialog = ({ id, isShared = false, name, onClose, setIsSharedAccessDialogOpen, ...rest }: Props) => {
    const { translate } = useTranslate();
    const { deleteCollection } = useModuleCommands(vaultOrganizationApi);
    const { commandHandler, isLoading } = useLoadingCommandWithAlert();
    const { deleteSharedCollection } = useModuleCommands(sharingCollectionsApi);
    const { users, userGroups } = useCollectionUsersAndGroupsData([id]);
    if (!users && !userGroups) {
        return (<BaseDialog content={<IndeterminateLoader />} onClose={onClose} title=""/>);
    }
    const sharedUsersCount = users?.length ?? 0;
    const sharedGroupsCount = userGroups?.length ?? 0;
    const isSharedWithSomeone = sharedUsersCount + sharedGroupsCount > 1;
    const titleKey = isSharedWithSomeone
        ? 'webapp_sharing_collection_cant_delete'
        : 'collections_dialog_delete_header_title';
    const contentKey = isSharedWithSomeone
        ? 'webapp_sharing_collection_cant_delete_description'
        : 'collections_dialog_delete_info_text';
    const handleDelete = async (event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        const deleteFunction = isShared ? deleteSharedCollection : deleteCollection;
        await commandHandler(() => deleteFunction({ id }), translate('collections_dialog_delete_success_toast_message', {
            name,
        }), translate('collections_dialog_delete_error_toast_message'));
        onClose();
    };
    const navigateToSharedAccess = () => {
        setIsSharedAccessDialogOpen(true);
        onClose();
    };
    return (<BaseDialog title={translate(titleKey)} content={translate(contentKey)} confirmAction={isSharedWithSomeone
            ? {
                children: translate('webapp_sharing_permissions_revoke'),
                onClick: navigateToSharedAccess,
                isLoading,
            }
            : {
                children: translate('collections_delete_button_text'),
                onClick: handleDelete,
                isLoading,
            }} isDestructive onClose={onClose} {...rest}/>);
};
