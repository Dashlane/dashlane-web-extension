import { map } from "rxjs";
import { IQueryHandler, QueryHandler } from "@dashlane/framework-application";
import { success } from "@dashlane/framework-types";
import { GetIsLastAdminForItemQuery } from "@dashlane/sharing-contracts";
import { SharedItemsRepository } from "../common/shared-items-repository";
@QueryHandler(GetIsLastAdminForItemQuery)
export class GetIsLastAdminForItemQueryHandler
  implements IQueryHandler<GetIsLastAdminForItemQuery>
{
  constructor(private readonly sharedItemsRepository: SharedItemsRepository) {}
  execute({ body }: GetIsLastAdminForItemQuery) {
    const { itemId } = body;
    return this.sharedItemsRepository
      .sharedItemForId$(itemId)
      .pipe(
        map((sharedItem) =>
          success({ isLastAdmin: Boolean(sharedItem?.isLastAdmin) })
        )
      );
  }
}
