import { combineLatestWith, map } from "rxjs";
import { IQueryHandler, QueryHandler } from "@dashlane/framework-application";
import { isFailure, success } from "@dashlane/framework-types";
import { GetItemIdsInSharedCollectionsQuery } from "@dashlane/sharing-contracts";
import {
  CurrentSpaceGetterService,
  ItemGroupsGetterService,
} from "../../../sharing-carbon-helpers";
import { toShareableCollection } from "./shared-collections-with-items.mapper";
import { SharedCollectionsRepository } from "../common/shared-collections.repository";
@QueryHandler(GetItemIdsInSharedCollectionsQuery)
export class GetItemIdsInSharedCollectionsQueryHandler
  implements IQueryHandler<GetItemIdsInSharedCollectionsQuery>
{
  constructor(
    private currentSpaceGetter: CurrentSpaceGetterService,
    private itemGroupsGetter: ItemGroupsGetterService,
    private collectionsRepository: SharedCollectionsRepository
  ) {}
  execute({ body }: GetItemIdsInSharedCollectionsQuery) {
    const { itemIds } = body;
    return this.collectionsRepository.collections$().pipe(
      combineLatestWith(
        this.currentSpaceGetter.get(),
        this.itemGroupsGetter.get()
      ),
      map(([sharedCollections, space, itemGroups]) => {
        if (isFailure(space) || isFailure(itemGroups)) {
          throw new Error("Unable to access sharing data");
        }
        const sharedCollectionsWithItems = sharedCollections.map(
          (sharedCollection) =>
            toShareableCollection(
              sharedCollection,
              itemGroups.data,
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
