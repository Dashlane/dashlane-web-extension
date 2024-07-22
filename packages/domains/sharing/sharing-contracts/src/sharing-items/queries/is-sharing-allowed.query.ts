import { defineQuery, UseCaseScope } from "@dashlane/framework-contracts";
export type IsSharingAllowedQueryResult = boolean;
export class IsSharingAllowedQuery extends defineQuery<IsSharingAllowedQueryResult>(
  {
    scope: UseCaseScope.User,
  }
) {}
