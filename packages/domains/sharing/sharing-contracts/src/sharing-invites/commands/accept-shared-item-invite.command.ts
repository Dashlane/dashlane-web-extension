import { defineCommand, UseCaseScope } from "@dashlane/framework-contracts";
export interface AcceptSharedItemInviteCommandParam {
  itemGroupId: string;
}
export class AcceptSharedItemInviteCommand extends defineCommand<AcceptSharedItemInviteCommandParam>(
  {
    scope: UseCaseScope.User,
  }
) {}
