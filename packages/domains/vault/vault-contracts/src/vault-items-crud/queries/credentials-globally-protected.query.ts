import { defineQuery, UseCaseScope } from "@dashlane/framework-contracts";
export type CredentialsGloballyProtectedResult = boolean;
export class CredentialsGloballyProtectedQuery extends defineQuery<CredentialsGloballyProtectedResult>(
  {
    scope: UseCaseScope.User,
  }
) {}
