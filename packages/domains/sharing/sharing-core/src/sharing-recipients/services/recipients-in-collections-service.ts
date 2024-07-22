import { filter, switchMap } from "rxjs";
import { Injectable } from "@dashlane/framework-application";
import { isSuccess } from "@dashlane/framework-types";
import { SharingCollectionsClient } from "@dashlane/sharing-contracts";
@Injectable()
export class RecipientsInCollectionsService {
  public constructor(
    private sharingCollectionsClient: SharingCollectionsClient
  ) {}
  public getUsersAndGroupsInCollectionsInSpace(spaceId: string | null) {
    const { sharedCollectionsWithItems, usersAndGroupsInCollection } =
      this.sharingCollectionsClient.queries;
    return sharedCollectionsWithItems().pipe(
      filter(isSuccess),
      switchMap((collectionsWithItems) => {
        const collectionIdsInSpace = collectionsWithItems.data.reduce(
          (acc: string[], collection) => {
            if (collection.spaceId === spaceId || spaceId === null) {
              acc.push(collection.id);
            }
            return acc;
          },
          []
        );
        return usersAndGroupsInCollection({
          collectionIds: collectionIdsInSpace,
        });
      })
    );
  }
  public getUsersAndGroupsInCollections() {
    const { getSharedCollections, usersAndGroupsInCollection } =
      this.sharingCollectionsClient.queries;
    return getSharedCollections({}).pipe(
      filter(isSuccess),
      switchMap((collections) => {
        const collectionIds = collections.data.map(
          (collection) => collection.uuid
        );
        return usersAndGroupsInCollection({
          collectionIds: collectionIds,
        });
      })
    );
  }
}
