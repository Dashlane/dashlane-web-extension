import { combineLatestWith, map } from "rxjs";
import { IQueryHandler, QueryHandler } from "@dashlane/framework-application";
import { isFailure, success } from "@dashlane/framework-types";
import {
  GetItemIdsInSharedCollectionsQuery,
  SharingItemsClient,
} from "@dashlane/sharing-contracts";
import { CurrentSpaceGetterService } from "../../../sharing-carbon-helpers";
import { SharedCollectionsRepository } from "../common/shared-collections.repository";
import { toShareableCollection } from "./shared-collections-with-items.mapper";
@QueryHandler(GetItemIdsInSharedCollectionsQuery)
export class GetItemIdsInSharedCollectionsQueryHandler
  implements IQueryHandler<GetItemIdsInSharedCollectionsQuery>
{
  constructor(
    private readonly currentSpaceGetter: CurrentSpaceGetterService,
    private readonly collectionsRepository: SharedCollectionsRepository,
    private readonly sharingItemsClient: SharingItemsClient
  ) {}
  execute({ body }: GetItemIdsInSharedCollectionsQuery) {
    const { itemIds } = body;
    return this.collectionsRepository.collections$().pipe(
      combineLatestWith(
        this.currentSpaceGetter.get(),
        this.sharingItemsClient.queries.getSharedItemsForItemIds({ itemIds })
      ),
      map(([sharedCollections, space, sharedItems]) => {
        if (isFailure(space) || isFailure(sharedItems)) {
          throw new Error("Unable to access sharing data");
        }
        const sharedItemsData = sharedItems.data.sharedItems;
        const sharedCollectionsWithItems = sharedCollections.map(
          (sharedCollection) =>
            toShareableCollection(
              sharedCollection,
              sharedItemsData,
              space.data.teamId
            )
        );
        const itemsInCollections = sharedCollectionsWithItems.flatMap(
          (coll) => coll.vaultItems
        );
        const targetItemIdsInCollections = itemIds.filter((id: string) =>
          itemsInCollections.some((item) => item.id === id)
        );
        return success(targetItemIdsInCollections);
      })
    );
  }
}
