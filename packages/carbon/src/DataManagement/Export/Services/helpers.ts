import { Collection, DataModelType } from "@dashlane/communication";
export const formatHeader = (
  metaData: {
    headerKey: string;
    dataKey: string;
  }[]
): string => {
  return metaData
    .map((data) => {
      return data.headerKey;
    })
    .join(",");
};
export function formatDataToCSV(contents: string[]): string {
  return contents.filter((content) => content.length > 0).join("\r\n");
}
export const getCollectionsByItemId = (
  collections: Collection[],
  itemType: DataModelType
) => {
  return collections.reduce(
    (collectionsByItemId: Record<string, string[]>, collection: Collection) => {
      const itemIds: string[] = collection.VaultItems.reduce((ids, item) => {
        if (item.Type !== itemType) {
          return ids;
        }
        return [...ids, item.Id];
      }, []);
      itemIds.forEach((itemId) => {
        if (collectionsByItemId[itemId]) {
          collectionsByItemId[itemId].push(collection.Name);
        } else {
          collectionsByItemId[itemId] = [collection.Name];
        }
      });
      return collectionsByItemId;
    },
    {}
  );
};
export const getItemCollections = (
  collectionsById: Record<string, string[]>,
  itemId: string
) => {
  const foundCollections = collectionsById[itemId];
  if (!foundCollections) {
    return "";
  }
  return foundCollections.join(", ");
};
