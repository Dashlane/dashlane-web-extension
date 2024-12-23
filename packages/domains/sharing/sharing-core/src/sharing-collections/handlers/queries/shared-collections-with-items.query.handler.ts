import { combineLatestWith, map } from "rxjs";
import { IQueryHandler, QueryHandler } from "@dashlane/framework-application";
import { isFailure, success } from "@dashlane/framework-types";
import {
  SharedCollectionsWithItemsQuery,
  SharingItemsClient,
} from "@dashlane/sharing-contracts";
import { CurrentSpaceGetterService } from "../../../sharing-carbon-helpers";
import { toShareableCollection } from "./shared-collections-with-items.mapper";
import { SharedCollectionsRepository } from "../common/shared-collections.repository";
@QueryHandler(SharedCollectionsWithItemsQuery)
export class SharedCollectionsWithItemsQueryHandler
  implements IQueryHandler<SharedCollectionsWithItemsQuery>
{
  constructor(
    private readonly collectionsRepository: SharedCollectionsRepository,
    private readonly currentSpaceGetter: CurrentSpaceGetterService,
    private readonly sharingItemsClient: SharingItemsClient
  ) {}
  execute() {
    return this.collectionsRepository.collections$().pipe(
      combineLatestWith(
        this.currentSpaceGetter.get(),
        this.sharingItemsClient.queries.getSharedItems()
      ),
      map(([sharedCollections, space, sharedItemsData]) => {
        if (isFailure(space)) {
          throw new Error("Failed to load shared collections");
        }
        if (isFailure(sharedItemsData)) {
          throw new Error("Failed to load shared items data");
        }
        return success(
          sharedCollections.map((sharedCollection) =>
            toShareableCollection(
              sharedCollection,
              sharedItemsData.data.sharedItems,
              space.data.teamId
            )
          )
        );
      })
    );
  }
}
