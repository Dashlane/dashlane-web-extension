import { Status } from "@dashlane/sharing-contracts";
export interface CollectionViewForFiltering {
  uuid: string;
  status?: Status;
  itemGroupKey?: string | null;
}
export const filterCollectionMembers = <T extends CollectionViewForFiltering>(
  members: T[] | undefined,
  myCollections: CollectionViewForFiltering[]
) =>
  members?.filter(
    (collection) =>
      myCollections.some(
        (collectionPair) => collectionPair.uuid === collection.uuid
      ) &&
      collection.status === Status.Accepted &&
      collection.itemGroupKey
  );
