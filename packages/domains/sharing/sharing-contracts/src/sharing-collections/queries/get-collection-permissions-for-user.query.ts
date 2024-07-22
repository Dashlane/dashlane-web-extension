import { defineQuery, UseCaseScope } from "@dashlane/framework-contracts";
import { CollectionPermissions } from "../sharing-collections.types";
export interface GetCollectionPermissionsForUserQueryParam {
  collectionId: string;
  userId?: string;
}
export class GetCollectionPermissionsForUserQuery extends defineQuery<
  CollectionPermissions,
  never,
  GetCollectionPermissionsForUserQueryParam
>({
  scope: UseCaseScope.User,
}) {}
