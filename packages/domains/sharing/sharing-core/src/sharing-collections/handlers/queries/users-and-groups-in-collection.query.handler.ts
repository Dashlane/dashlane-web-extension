import { IQueryHandler, QueryHandler } from "@dashlane/framework-application";
import { UsersAndGroupsInCollectionQuery } from "@dashlane/sharing-contracts";
import { SharedCollectionsRepository } from "../common/shared-collections.repository";
@QueryHandler(UsersAndGroupsInCollectionQuery)
export class UsersAndGroupsInCollectionQueryHandler
  implements IQueryHandler<UsersAndGroupsInCollectionQuery>
{
  constructor(private collectionsRepository: SharedCollectionsRepository) {}
  execute({ body }: UsersAndGroupsInCollectionQuery) {
    const { collectionIds } = body;
    return this.collectionsRepository.usersAndGroupsInCollection(collectionIds);
  }
}
