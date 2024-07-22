import { combineLatestWith, map } from "rxjs";
import { IQueryHandler, QueryHandler } from "@dashlane/framework-application";
import { success } from "@dashlane/framework-types";
import {
  GetCollectionsForUserOrGroupQuery,
  SharedCollection,
} from "@dashlane/sharing-contracts";
import { UserGroupsGetterService } from "../../../sharing-carbon-helpers";
import { SharedCollectionsRepository } from "../common/shared-collections.repository";
@QueryHandler(GetCollectionsForUserOrGroupQuery)
export class GetCollectionsForUserOrGroupQueryHandler
  implements IQueryHandler<GetCollectionsForUserOrGroupQuery>
{
  constructor(
    private collectionsRepository: SharedCollectionsRepository,
    private userGroupGetter: UserGroupsGetterService
  ) {}
  execute({ body }: GetCollectionsForUserOrGroupQuery) {
    const { targetId } = body;
    return this.userGroupGetter.getCarbonUserGroups$().pipe(
      combineLatestWith(this.collectionsRepository.collections$()),
      map(([userGroups, sharedCollections]) => {
        const collections: SharedCollection[] = sharedCollections.filter(
          (collection: SharedCollection) => {
            const isUserInCollection = collection.users?.some(
              (user) => user.login === targetId
            );
            if (isUserInCollection) {
              return true;
            }
            const groupsInCollection = collection.userGroups;
            const isGroupInCollection = groupsInCollection?.some(
              (group) => group.uuid === targetId
            );
            if (isGroupInCollection) {
              return true;
            }
            const userGroupsImIn = userGroups.filter((group) =>
              group.users.some((user) => user.userId === targetId)
            );
            const isUserInGroupInCollection = groupsInCollection?.some(
              (collectionGroup) =>
                userGroupsImIn.some(
                  (groupImIn) => groupImIn.groupId === collectionGroup.uuid
                )
            );
            return isUserInGroupInCollection;
          }
        );
        return success({ collections });
      })
    );
  }
}
