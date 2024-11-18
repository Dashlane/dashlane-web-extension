import { IQueryHandler, QueryHandler } from "@dashlane/framework-application";
import { GetSharedItemsQuery } from "@dashlane/sharing-contracts";
import { SharedItemsRepository } from "../common/shared-items-repository";
import { map } from "rxjs";
import { success } from "@dashlane/framework-types";
@QueryHandler(GetSharedItemsQuery)
export class GetSharedItemsQueryHandler
  implements IQueryHandler<GetSharedItemsQuery>
{
  constructor(private readonly sharedItemsRepository: SharedItemsRepository) {}
  execute() {
    return this.sharedItemsRepository
      .sharedItems$()
      .pipe(map((sharedItems) => success({ sharedItems })));
  }
}
