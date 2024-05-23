import { useMemo, useState } from 'react';
import { jsx } from '@dashlane/design-system';
import { useModuleCommands } from '@dashlane/framework-react';
import { AlertSeverity } from '@dashlane/ui-components';
import { VaultItemType, vaultOrganizationApi } from '@dashlane/vault-contracts';
import { useAlert } from 'libs/alert-notifications/use-alert';
import useTranslate from 'libs/i18n/useTranslate';
import { CollectionInputWithSelection } from 'webapp/vault/collections-layout';
import { useCollectionsContext } from 'webapp/vault/collections-context';
import { useLoadingCommandWithAlert } from 'webapp/vault/use-loading-command-with-alert';
import { MenuItemWithActionCard } from './layout/menu-item-with-action-card';
import { ActionType } from './active-action-context';
import { Permission, sharingCollectionsApi } from '@dashlane/sharing-contracts';
import { useDialog } from 'webapp/dialog';
import { AddSharedCollectionDialog } from 'webapp/credentials/form/collections-field/add-shared-collection-dialog';
export interface AddToCollectionActionProps {
    itemId: string;
    itemName: string;
    itemSpaceId: string;
}
export const AddToCollectionAction = ({ itemId, itemName, itemSpaceId, }: AddToCollectionActionProps) => {
    const { translate } = useTranslate();
    const { openDialog, closeDialog } = useDialog();
    const { createCollection, updateCollection } = useModuleCommands(vaultOrganizationApi);
    const { addItemToCollections } = useModuleCommands(sharingCollectionsApi);
    const { commandHandler } = useLoadingCommandWithAlert();
    const { allCollections: collections } = useCollectionsContext();
    const [input, setInput] = useState('');
    const { showAlert } = useAlert();
    const vaultItemCollections = useMemo(() => collections.filter((collection) => collection.spaceId === itemSpaceId &&
        !collection.vaultItems.some((item) => item.id === itemId)), [collections]);
    const onSubmit = (collectionName = input) => {
        collectionName = collectionName.trim();
        if (collectionName.length <= 0) {
            return;
        }
        const selectedCollection = collections.find((collection) => collection.name === collectionName &&
            collection.spaceId === itemSpaceId);
        const vaultItem = { id: itemId, type: VaultItemType.Credential };
        const createSuccessMessage = translate('collections_quick_action_add_create_success_toast_message', {
            vaultItemName: itemName,
            collectionName: collectionName,
        });
        const updateSuccessMessage = translate('collections_quick_action_add_update_success_toast_message', {
            vaultItemName: itemName,
            collectionName: collectionName,
        });
        const errorMessage = translate('_common_generic_error');
        if (selectedCollection) {
            if (vaultItemCollections.filter((item) => item.name === collectionName)
                .length === 0) {
                showAlert(translate('webapp_collection_already_created_warning'), AlertSeverity.ERROR);
                return;
            }
            const handleSubmit = () => commandHandler(() => {
                return addItemToCollections({
                    collectionIds: [selectedCollection.id],
                    itemId,
                    defaultItemPermissions: Permission.Limited,
                });
            }, updateSuccessMessage, errorMessage).then(() => {
                closeDialog();
                setInput('');
            });
            if (selectedCollection.isShared) {
                openDialog(<AddSharedCollectionDialog onSubmit={handleSubmit} onClose={closeDialog} itemTitle={itemName} collectionName={selectedCollection.name}/>);
            }
            else {
                commandHandler(() => {
                    return updateCollection({
                        id: selectedCollection.id,
                        collection: {
                            vaultItems: [vaultItem],
                        },
                    });
                }, updateSuccessMessage, errorMessage).then(() => setInput(''));
            }
        }
        else {
            commandHandler(() => createCollection({
                content: {
                    name: collectionName,
                    spaceId: itemSpaceId,
                    vaultItems: [vaultItem],
                },
            }), createSuccessMessage, errorMessage).then(() => setInput(''));
        }
    };
    return (<MenuItemWithActionCard text={translate('collections_quick_action_add_menu_text')} iconName="FolderOutlined" actionType={ActionType.AddTo}>
      <CollectionInputWithSelection collections={vaultItemCollections} id={`add_to_collection_action_for_${itemId}`} input={input} spaceId={itemSpaceId} onSubmit={onSubmit} setInput={setInput} sx={{
            width: 'inherit',
            '> div:first-of-type': {
                margin: '8px',
                width: 'unset',
            },
        }}/>
    </MenuItemWithActionCard>);
};
