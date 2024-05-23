import React from 'react';
import { useModuleCommands } from '@dashlane/framework-react';
import { OperationType, VaultItemType, vaultOrganizationApi, } from '@dashlane/vault-contracts';
import { ShareableCollection } from '@dashlane/sharing-contracts';
import { useCollectionsContext } from 'webapp/vault/collections-context';
import { RemoveFromACollection } from './remove-from-a-collection';
import { RemoveFromActiveCollection } from './remove-from-active-collection';
interface RemoveCollectionQuickActionProps {
    itemId: string;
    itemName: string;
}
export const RemoveCollectionQuickAction = ({ itemId, itemName, }: RemoveCollectionQuickActionProps) => {
    const { activeCollection, allCollections: collections } = useCollectionsContext();
    const { updateCollection } = useModuleCommands(vaultOrganizationApi);
    const onUndoClicked = (collection: ShareableCollection, credentialId: string) => {
        return updateCollection({
            id: collection.id,
            collection: {
                vaultItems: [
                    {
                        id: credentialId,
                        type: VaultItemType.Credential,
                    },
                ],
            },
            operationType: OperationType.APPEND_VAULT_ITEMS,
        });
    };
    if (activeCollection) {
        return (<RemoveFromActiveCollection credentialId={itemId} title={itemName} onUndoClicked={onUndoClicked}/>);
    }
    const isCredentialInACollection = collections.some((collection) => collection.vaultItems.some((item) => item.id === itemId));
    return isCredentialInACollection ? (<RemoveFromACollection credentialId={itemId} title={itemName} onUndoClicked={onUndoClicked}/>) : null;
};
