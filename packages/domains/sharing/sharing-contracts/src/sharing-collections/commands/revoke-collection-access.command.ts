import { defineCommand, UseCaseScope } from "@dashlane/framework-contracts";
export interface RevokeCollectionMembersCommandParam {
  collectionId: string;
  userLogins?: string[];
  userGroupIds?: string[];
}
export class RevokeCollectionMembersCommand extends defineCommand<RevokeCollectionMembersCommandParam>(
  {
    scope: UseCaseScope.User,
  }
) {}
