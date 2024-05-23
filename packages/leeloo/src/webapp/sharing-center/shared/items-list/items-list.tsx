import { Fragment } from 'react';
import { CredentialItemView, GroupRecipient, UserRecipient, } from '@dashlane/communication';
import { jsx } from '@dashlane/design-system';
import { Secret, SecureNote } from '@dashlane/vault-contracts';
import { SharedCollection } from '@dashlane/sharing-contracts';
import { useGetItemIdsInSharedCollectionsData } from 'libs/hooks/use-are-items-in-shared-collection';
import { CollectionItemView, ItemRow, } from 'webapp/sharing-center/shared/items-list/item-row';
import { EmptySearchResults } from 'webapp/sharing-center/shared/empty-search-results';
interface ItemListProps {
    collections?: SharedCollection[];
    credentials: CredentialItemView[];
    notes: SecureNote[];
    secrets: Secret[];
    entity: UserRecipient | GroupRecipient;
}
const sortItems = (items: (CredentialItemView | SecureNote | Secret | CollectionItemView)[]) => items.sort((itemA, itemB) => {
    const getCompareString = (item: {
        title?: string;
        name?: string;
    }) => item.title ?? item.name ?? '';
    return getCompareString(itemA).localeCompare(getCompareString(itemB));
});
export const ItemsList = ({ collections = [], credentials, notes, secrets, entity, }: ItemListProps) => {
    const collectionItems: CollectionItemView[] = collections?.map((collection) => ({
        id: collection.uuid,
        title: collection.name,
        url: '',
        login: entity.type === 'user' ? entity.alias : entity.groupId,
        isCollection: true,
    }));
    const items: (CollectionItemView | CredentialItemView | SecureNote | Secret)[] = [...collectionItems, ...credentials, ...notes, ...secrets];
    const isCollectionList = !!collectionItems.length && !credentials.length && !notes.length;
    const itemIds = credentials?.map((item) => item.id);
    const itemsInCollections = useGetItemIdsInSharedCollectionsData(itemIds);
    const sortedItems = sortItems(items);
    return (<div sx={{
            display: 'flex',
            flexDirection: 'column',
            flex: '1',
            margin: '0',
            overflow: 'none',
        }}>
      {sortedItems.length === 0 ? (<EmptySearchResults />) : (<>
          {sortedItems.map((item, index) => (<ItemRow key={item.id} rowIndex={index} item={item} entity={entity} isItemInSharedCollection={itemsInCollections.includes(item.id)} isCollectionList={isCollectionList}/>))}
        </>)}
    </div>);
};
