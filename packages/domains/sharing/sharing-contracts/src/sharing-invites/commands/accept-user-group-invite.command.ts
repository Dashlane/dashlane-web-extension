import { defineCommand, UseCaseScope } from "@dashlane/framework-contracts";
export interface AcceptUserGroupInviteCommandParam {
  userGroupId: string;
}
export class AcceptUserGroupInviteCommand extends defineCommand<AcceptUserGroupInviteCommandParam>(
  {
    scope: UseCaseScope.User,
  }
) {}
