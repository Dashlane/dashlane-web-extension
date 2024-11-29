import { GroupRecipient, UserRecipient } from "@dashlane/communication";
import {
  Credential,
  Secret,
  SecureNote,
  VaultItemType,
} from "@dashlane/vault-contracts";
import { SharedCollection } from "@dashlane/sharing-contracts";
import { useGetItemIdsInSharedCollectionsData } from "../../../../libs/hooks/use-are-items-in-shared-collection";
import { CollectionItemView, ItemRow } from "./item-row";
import { EmptySearchResults } from "../empty-search-results";
interface ItemListProps {
  collections?: SharedCollection[];
  credentials: Credential[];
  notes: SecureNote[];
  secrets: Secret[];
  entity: UserRecipient | GroupRecipient;
}
export interface SharedItem {
  item: Credential | SecureNote | Secret | CollectionItemView;
  type: string;
}
const sortItems = (items: SharedItem[]) => {
  return items.sort((itemA, itemB) => {
    const getCompareString = (item: { title?: string; itemName?: string }) =>
      item.title ?? item.itemName ?? "";
    return getCompareString(itemA.item).localeCompare(
      getCompareString(itemB.item)
    );
  });
};
export const ItemsList = ({
  collections = [],
  credentials,
  notes,
  secrets,
  entity,
}: ItemListProps) => {
  const collectionItems: CollectionItemView[] = collections?.map(
    (collection) => ({
      id: collection.uuid,
      title: collection.name,
      url: "",
      login: entity.type === "user" ? entity.alias : entity.groupId,
      isCollection: true,
    })
  );
  const items = [
    ...collectionItems.map((collection) => ({
      item: collection,
      type: "collection",
    })),
    ...credentials.map((credential) => ({
      item: credential,
      type: VaultItemType.Credential,
    })),
    ...notes.map((note) => ({ item: note, type: VaultItemType.SecureNote })),
    ...secrets.map((secret) => ({ item: secret, type: VaultItemType.Secret })),
  ];
  const isCollectionList =
    !!collectionItems.length && !credentials.length && !notes.length;
  const itemIds = credentials?.map((item) => item.id);
  const itemsInCollections = useGetItemIdsInSharedCollectionsData(itemIds);
  return (
    <div
      sx={{
        display: "flex",
        flexDirection: "column",
        flex: "1",
        margin: "0",
        overflow: "none",
      }}
    >
      {items.length === 0 ? (
        <EmptySearchResults />
      ) : (
        <>
          {sortItems(items).map((sortedItem, index) => (
            <ItemRow
              key={sortedItem.item.id}
              rowIndex={index}
              sortedItem={sortedItem}
              entity={entity}
              isItemInSharedCollection={itemsInCollections.includes(
                sortedItem.item.id
              )}
              isCollectionList={isCollectionList}
            />
          ))}
        </>
      )}
    </div>
  );
};
