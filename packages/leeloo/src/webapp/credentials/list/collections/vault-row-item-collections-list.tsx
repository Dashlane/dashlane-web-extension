import { jsx } from '@dashlane/design-system';
import { useCollectionsContext } from 'webapp/vault/collections-context';
import { CollectionChip, CollectionsList, CollectionsListItem, } from 'webapp/vault/collections-layout';
interface Props {
    vaultItemId: string;
}
export const VaultRowItemCollectionsList = ({ vaultItemId }: Props) => {
    const { allCollections } = useCollectionsContext();
    if (!allCollections.length) {
        return null;
    }
    const itemCollections = allCollections.filter((collection) => collection.vaultItems.some((item) => item.id === vaultItemId));
    return (<CollectionsList sx={{ margin: '14px 0' }} data-testid="collections-list" collectionListItems={itemCollections.map((collection) => (<CollectionsListItem key={`vault_row_item_collections_list_${collection.id}`}>
          <CollectionChip isShared={collection.isShared}>
            {collection.name}
          </CollectionChip>
        </CollectionsListItem>))}/>);
};
