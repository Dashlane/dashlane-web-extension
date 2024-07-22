import { map } from "rxjs";
import { IQueryHandler, QueryHandler } from "@dashlane/framework-application";
import { GetCollectionRoleForGroupQuery } from "@dashlane/sharing-contracts";
import { success } from "@dashlane/framework-types";
import { SharingCollectionAccessService } from "../common/shared-collection-access.service";
@QueryHandler(GetCollectionRoleForGroupQuery)
export class GetCollectionRoleForGroupQueryHandler
  implements IQueryHandler<GetCollectionRoleForGroupQuery>
{
  constructor(private sharingAccess: SharingCollectionAccessService) {}
  execute({ body }: GetCollectionRoleForGroupQuery) {
    const { collectionId, groupId } = body;
    return this.sharingAccess
      .getGroupRoleInCollection$(collectionId, groupId)
      .pipe(map((role) => success(role)));
  }
}
