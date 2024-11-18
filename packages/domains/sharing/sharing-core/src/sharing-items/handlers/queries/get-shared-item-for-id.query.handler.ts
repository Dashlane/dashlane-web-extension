import { from, map } from "rxjs";
import {
  IQueryHandler,
  QueryHandler,
  type QueryHandlerResponseOf,
} from "@dashlane/framework-application";
import { GetSharedItemForIdQuery } from "@dashlane/sharing-contracts";
import { success } from "@dashlane/framework-types";
import { SharedItemsRepository } from "../common/shared-items-repository";
@QueryHandler(GetSharedItemForIdQuery)
export class GetSharedItemForIdQueryHandler
  implements IQueryHandler<GetSharedItemForIdQuery>
{
  public constructor(private readonly repo: SharedItemsRepository) {}
  execute({
    body,
  }: GetSharedItemForIdQuery): QueryHandlerResponseOf<GetSharedItemForIdQuery> {
    const { itemId } = body;
    return from(this.repo.sharedItemForId$(itemId)).pipe(
      map((sharedItem) => success({ sharedItem }))
    );
  }
}
