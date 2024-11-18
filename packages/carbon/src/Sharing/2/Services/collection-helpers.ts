import { CollectionDownload, ItemGroupDownload } from "@dashlane/server-sdk/v1";
import { SharingData } from "Session/Store/sharingData/types";
export { CollectionDownload, ItemGroupDownload };
interface VaultItem {
  id: string;
}
export interface SharedCollection {
  id: string;
  name: string;
  vaultItems: VaultItem[];
}
export interface SharingDataWithCollections {
  collections: CollectionDownload[];
  itemGroupById: Record<string, ItemGroupDownload>;
}
export const filterUndefinedVaultItems = (
  item: Partial<VaultItem>
): item is VaultItem => {
  return item.id !== undefined;
};
export const toVaultItemModel = (
  sharedItemGroup: ItemGroupDownload
): {
  id: string | undefined;
} => ({
  id: sharedItemGroup.items?.[0].itemId,
});
export const toCollectionModel =
  (sharedItemGroups: ItemGroupDownload[]) =>
  (collection: CollectionDownload): SharedCollection => ({
    id: collection.uuid,
    name: collection.name,
    vaultItems: sharedItemGroups
      .filter((group) =>
        group.collections?.find(
          (groupMember) => groupMember.uuid === collection.uuid
        )
      )
      .map(toVaultItemModel)
      .filter(filterUndefinedVaultItems),
  });
export const getSharedItemGroupsById = (
  sharedItemGroups?: ItemGroupDownload[]
): Record<string, ItemGroupDownload> => {
  if (sharedItemGroups && sharedItemGroups.length > 0) {
    return sharedItemGroups.reduce(
      (itemGroups, itemGroup) => ({
        ...itemGroups,
        [itemGroup.groupId]: itemGroup,
      }),
      {}
    );
  }
  return {};
};
export const getSharingDataWithCollections = (
  sharingData: SharingData
): {
  collections: CollectionDownload[];
  itemGroups: ItemGroupDownload[];
} => {
  return {
    collections: sharingData.collections ?? [],
    itemGroups: sharingData.itemGroups as ItemGroupDownload[],
  };
};
