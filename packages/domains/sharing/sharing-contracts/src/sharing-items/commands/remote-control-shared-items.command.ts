import { defineCommand, UseCaseScope } from "@dashlane/framework-contracts";
export interface RemoteControlSharedItemsCommandParam {
  vaultItemIds: string[];
  pendingInvitesIds: string[];
  shouldRunSync: boolean;
}
export class RemoteControlSharedItemsCommand extends defineCommand<RemoteControlSharedItemsCommandParam>(
  {
    scope: UseCaseScope.User,
  }
) {}
