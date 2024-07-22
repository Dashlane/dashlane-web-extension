import { IQueryHandler, QueryHandler } from "@dashlane/framework-application";
import { mapSuccessObservable } from "@dashlane/framework-types";
import { ItemGroupsGetterService } from "../../../sharing-carbon-helpers";
import { GetItemGroupIdForItemIdQuery } from "@dashlane/sharing-contracts";
@QueryHandler(GetItemGroupIdForItemIdQuery)
export class GetItemGroupIdForItemIdQueryHandler
  implements IQueryHandler<GetItemGroupIdForItemIdQuery>
{
  constructor(private itemGroupsGetter: ItemGroupsGetterService) {}
  execute({ body }: GetItemGroupIdForItemIdQuery) {
    const { itemId } = body;
    return this.itemGroupsGetter.getForItemId(itemId).pipe(
      mapSuccessObservable((itemGroup) => ({
        itemGroupId: itemGroup?.groupId,
      }))
    );
  }
}
