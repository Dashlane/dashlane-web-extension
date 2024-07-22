import { map } from "rxjs";
import { IQueryHandler, QueryHandler } from "@dashlane/framework-application";
import { success } from "@dashlane/framework-types";
import {
  SharedCollection,
  UsersAndGroupsInCollectionQuery,
} from "@dashlane/sharing-contracts";
import { SharedCollectionsRepository } from "../common/shared-collections.repository";
@QueryHandler(UsersAndGroupsInCollectionQuery)
export class UsersAndGroupsInCollectionQueryHandler
  implements IQueryHandler<UsersAndGroupsInCollectionQuery>
{
  constructor(private collectionsRepository: SharedCollectionsRepository) {}
  execute({ body }: UsersAndGroupsInCollectionQuery) {
    const { collectionIds } = body;
    return this.collectionsRepository.collections$().pipe(
      map((sharedCollections) => {
        const targetCollections: SharedCollection[] = sharedCollections.filter(
          (collection: SharedCollection) =>
            collectionIds.includes(collection.uuid)
        );
        const usersList = targetCollections.flatMap((coll) =>
          coll.users ? coll.users : []
        );
        const users = usersList.map((user) => ({
          id: user.login,
          label: user.login,
          status: user.status,
          permission: user.permission,
        }));
        const userGroupsList = targetCollections.flatMap((coll) =>
          coll.userGroups ? coll.userGroups : []
        );
        const userGroups = userGroupsList.map((group) => ({
          id: group.uuid,
          label: group.name,
          status: group.status,
          permission: group.permission,
        }));
        return success({ userGroups, users });
      })
    );
  }
}
