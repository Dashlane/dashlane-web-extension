import { defineQuery, UseCaseScope } from "@dashlane/framework-contracts";
export type GetVaultNotificationsStatusQueryResult = {
  isCollectionGuidedIntroEnabled: boolean;
  hasSeenFreeUserFrozenState: boolean;
};
export class GetVaultNotificationsStatusQuery extends defineQuery<GetVaultNotificationsStatusQueryResult>(
  {
    scope: UseCaseScope.User,
  }
) {}
