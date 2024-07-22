import { defineQuery, UseCaseScope } from "@dashlane/framework-contracts";
export type GetSharingTeamLoginsResult = {
  userLogins: string[];
};
export class GetSharingTeamLoginsQuery extends defineQuery<GetSharingTeamLoginsResult>(
  {
    scope: UseCaseScope.User,
  }
) {}
