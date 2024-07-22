import { defineQuery, UseCaseScope } from "@dashlane/framework-contracts";
export type HasInvitesQueryResult = boolean;
export class HasInvitesQuery extends defineQuery<HasInvitesQueryResult>({
  scope: UseCaseScope.User,
}) {}
