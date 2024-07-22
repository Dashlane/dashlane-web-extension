import { defineQuery, UseCaseScope } from "@dashlane/framework-contracts";
import { SharedCollectionRole } from "../sharing-collections.types";
export interface GetCollectionRoleForGroupQueryParam {
  collectionId: string;
  groupId?: string;
}
export class GetCollectionRoleForGroupQuery extends defineQuery<
  SharedCollectionRole,
  never,
  GetCollectionRoleForGroupQueryParam
>({
  scope: UseCaseScope.User,
}) {}
