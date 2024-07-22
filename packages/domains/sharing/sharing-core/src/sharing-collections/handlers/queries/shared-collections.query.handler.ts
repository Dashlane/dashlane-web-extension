import { map } from "rxjs";
import { IQueryHandler, QueryHandler } from "@dashlane/framework-application";
import { success } from "@dashlane/framework-types";
import { GetSharedCollectionsQuery } from "@dashlane/sharing-contracts";
import { SharedCollectionsRepository } from "../common/shared-collections.repository";
@QueryHandler(GetSharedCollectionsQuery)
export class GetSharedCollectionsQueryHandler
  implements IQueryHandler<GetSharedCollectionsQuery>
{
  constructor(private collectionsRepository: SharedCollectionsRepository) {}
  execute({ body }: GetSharedCollectionsQuery) {
    const collectionIds = body.collectionIds ? body.collectionIds : [];
    const allCollections$ = this.collectionsRepository.collections$();
    return allCollections$.pipe(
      map((collections) =>
        success(
          collections.filter((collection) => {
            if (collectionIds.length) {
              return collectionIds.includes(collection.uuid);
            } else {
              return true;
            }
          })
        )
      )
    );
  }
}
