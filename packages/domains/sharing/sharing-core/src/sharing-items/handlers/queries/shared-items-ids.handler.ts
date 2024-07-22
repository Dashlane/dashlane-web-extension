import {
  IQueryHandler,
  QueryHandler,
  QueryHandlerResponseOf,
} from "@dashlane/framework-application";
import { mapSuccessObservable } from "@dashlane/framework-types";
import { ItemGroupsGetterService } from "../../../sharing-carbon-helpers";
import { SharedItemsIdsQuery } from "@dashlane/sharing-contracts";
@QueryHandler(SharedItemsIdsQuery)
export class SharedItemsIdsQueryHandler
  implements IQueryHandler<SharedItemsIdsQuery>
{
  constructor(private itemGroups: ItemGroupsGetterService) {}
  execute(): QueryHandlerResponseOf<SharedItemsIdsQuery> {
    return this.itemGroups
      .get()
      .pipe(
        mapSuccessObservable((itemGroups) =>
          itemGroups.reduce(
            (result, next) => [
              ...result,
              ...(next.items?.map((item) => item.itemId) ?? []),
            ],
            [] as string[]
          )
        )
      );
  }
}
