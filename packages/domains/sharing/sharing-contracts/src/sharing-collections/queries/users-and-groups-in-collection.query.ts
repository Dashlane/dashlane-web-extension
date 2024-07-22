import { defineQuery, UseCaseScope } from "@dashlane/framework-contracts";
import { UsersAndGroupsInCollection } from "../sharing-collections.types";
export interface UsersAndGroupsInCollectionQueryParam {
  collectionIds: string[];
}
export class UsersAndGroupsInCollectionQuery extends defineQuery<
  UsersAndGroupsInCollection,
  never,
  UsersAndGroupsInCollectionQueryParam
>({
  scope: UseCaseScope.User,
}) {}
