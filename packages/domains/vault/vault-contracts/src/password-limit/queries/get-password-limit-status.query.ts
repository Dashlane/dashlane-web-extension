import { defineQuery, UseCaseScope } from "@dashlane/framework-contracts";
export type GetPasswordLimitStatusQueryResult =
  | {
      hasLimit: false;
    }
  | {
      hasLimit: true;
      passwordsLeft: number;
      limit: number;
    };
export class GetPasswordLimitStatusQuery extends defineQuery<GetPasswordLimitStatusQueryResult>(
  {
    scope: UseCaseScope.User,
  }
) {}
