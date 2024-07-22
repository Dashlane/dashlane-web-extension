import { map } from "rxjs";
import { IQueryHandler, QueryHandler } from "@dashlane/framework-application";
import { success } from "@dashlane/framework-types";
import { GetSharedItemsForItemIdsQuery } from "@dashlane/sharing-contracts";
import { SharedItemsRepository } from "../common/shared-items-repository";
@QueryHandler(GetSharedItemsForItemIdsQuery)
export class GetSharedItemsForItemIdsQueryHandler
  implements IQueryHandler<GetSharedItemsForItemIdsQuery>
{
  constructor(private sharedItemsRepository: SharedItemsRepository) {}
  execute({ body }: GetSharedItemsForItemIdsQuery) {
    const { itemIds } = body;
    return this.sharedItemsRepository
      .sharedItemsForIds$(itemIds)
      .pipe(map((sharedItems) => success({ sharedItems })));
  }
}
