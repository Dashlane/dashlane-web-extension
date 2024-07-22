import { combineLatestWith, map } from "rxjs";
import { IQueryHandler, QueryHandler } from "@dashlane/framework-application";
import { isFailure, success } from "@dashlane/framework-types";
import { SharedCollectionsWithItemsQuery } from "@dashlane/sharing-contracts";
import {
  CurrentSpaceGetterService,
  ItemGroupsGetterService,
} from "../../../sharing-carbon-helpers";
import { toShareableCollection } from "./shared-collections-with-items.mapper";
import { SharedCollectionsRepository } from "../common/shared-collections.repository";
@QueryHandler(SharedCollectionsWithItemsQuery)
export class SharedCollectionsWithItemsQueryHandler
  implements IQueryHandler<SharedCollectionsWithItemsQuery>
{
  constructor(
    private collectionsRepository: SharedCollectionsRepository,
    private currentSpaceGetter: CurrentSpaceGetterService,
    private itemGroupsGetter: ItemGroupsGetterService
  ) {}
  execute() {
    return this.collectionsRepository.collections$().pipe(
      combineLatestWith(
        this.currentSpaceGetter.get(),
        this.itemGroupsGetter.get()
      ),
      map(([sharedCollections, space, itemGroups]) => {
        if (isFailure(space) || isFailure(itemGroups)) {
          throw new Error("Failed to load shared collections");
        }
        return success(
          sharedCollections.map((sharedCollection) =>
            toShareableCollection(
              sharedCollection,
              itemGroups.data,
              space.data.teamId
            )
          )
        );
      })
    );
  }
}
