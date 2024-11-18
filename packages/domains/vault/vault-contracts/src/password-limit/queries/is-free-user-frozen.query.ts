import { defineQuery, UseCaseScope } from "@dashlane/framework-contracts";
export type IsFreeUserFrozenQueryResult = boolean;
export class IsFreeUserFrozenQuery extends defineQuery<IsFreeUserFrozenQueryResult>(
  {
    scope: UseCaseScope.User,
    useCache: true,
  }
) {}
