import { map } from "rxjs";
import { IQueryHandler, QueryHandler } from "@dashlane/framework-application";
import { success } from "@dashlane/framework-types";
import { GetPermissionForItemQuery } from "@dashlane/sharing-contracts";
import { SharedItemsRepository } from "../common/shared-items-repository";
@QueryHandler(GetPermissionForItemQuery)
export class GetPermissionForItemQueryHandler
  implements IQueryHandler<GetPermissionForItemQuery>
{
  constructor(private readonly sharedItemsRepository: SharedItemsRepository) {}
  execute({ body }: GetPermissionForItemQuery) {
    const { itemId } = body;
    return this.sharedItemsRepository
      .sharedItemForId$(itemId)
      .pipe(
        map((sharedItem) => success({ permission: sharedItem?.permission }))
      );
  }
}
