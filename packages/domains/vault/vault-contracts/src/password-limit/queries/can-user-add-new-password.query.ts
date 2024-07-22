import { defineQuery, UseCaseScope } from "@dashlane/framework-contracts";
export type CanUserAddNewPasswordQueryResult = boolean;
export class CanUserAddNewPasswordQuery extends defineQuery<CanUserAddNewPasswordQueryResult>(
  {
    scope: UseCaseScope.User,
  }
) {}
