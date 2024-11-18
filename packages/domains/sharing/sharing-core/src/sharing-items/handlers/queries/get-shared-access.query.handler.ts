import { IQueryHandler, QueryHandler } from "@dashlane/framework-application";
import { GetSharedAccessQuery } from "@dashlane/sharing-contracts";
import { SharedItemsRepository } from "../common/shared-items-repository";
import { map } from "rxjs";
import { success } from "@dashlane/framework-types";
@QueryHandler(GetSharedAccessQuery)
export class GetSharedAccessQueryHandler
  implements IQueryHandler<GetSharedAccessQuery>
{
  constructor(private readonly sharedItemsRepository: SharedItemsRepository) {}
  execute() {
    return this.sharedItemsRepository
      .sharedAccess$()
      .pipe(map((sharedAccess) => success({ sharedAccess })));
  }
}
