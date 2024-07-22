import { map } from "rxjs";
import { IQueryHandler, QueryHandler } from "@dashlane/framework-application";
import { success } from "@dashlane/framework-types";
import {
  GetPermissionForItemsQuery,
  GetPermissionForItemsResult,
} from "@dashlane/sharing-contracts";
import { SharedItemsRepository } from "../common/shared-items-repository";
@QueryHandler(GetPermissionForItemsQuery)
export class GetPermissionForItemsQueryHandler
  implements IQueryHandler<GetPermissionForItemsQuery>
{
  constructor(private readonly sharedItemsRepository: SharedItemsRepository) {}
  execute({ body }: GetPermissionForItemsQuery) {
    const { itemIds } = body;
    return this.sharedItemsRepository.sharedItemsForIds$(itemIds).pipe(
      map((items) => {
        return success(
          items.reduce((acc, item) => {
            acc[item.itemId] = item.permission;
            return acc;
          }, {} as GetPermissionForItemsResult)
        );
      })
    );
  }
}
