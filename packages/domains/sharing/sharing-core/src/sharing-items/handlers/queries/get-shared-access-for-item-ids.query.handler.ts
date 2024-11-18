import { IQueryHandler, QueryHandler } from "@dashlane/framework-application";
import { GetSharedAccessForItemIdsQuery } from "@dashlane/sharing-contracts";
import { SharedItemsRepository } from "../common/shared-items-repository";
import { map } from "rxjs";
import { success } from "@dashlane/framework-types";
@QueryHandler(GetSharedAccessForItemIdsQuery)
export class GetSharedAccessForItemIdsQueryHandler
  implements IQueryHandler<GetSharedAccessForItemIdsQuery>
{
  constructor(private readonly sharedItemsRepository: SharedItemsRepository) {}
  execute({ body }: GetSharedAccessForItemIdsQuery) {
    const { itemIds } = body;
    return this.sharedItemsRepository
      .sharedAccessForIds$(itemIds)
      .pipe(map((sharedAccess) => success({ sharedAccess })));
  }
}
