import { firstValueFrom } from "rxjs";
import {
  CommandHandler,
  type ICommandHandler,
} from "@dashlane/framework-application";
import { isFailure, success } from "@dashlane/framework-types";
import {
  RecipientTypes,
  RevokeSharedItemCommand,
  RevokeSharedItemCommandParam,
} from "@dashlane/sharing-contracts";
import { ItemGroupsGetterService } from "../../../sharing-carbon-helpers";
import { SharingSyncService } from "../../../sharing-common";
import {
  ITEM_GROUP_MEMBER_INVALID_REVISION,
  SharingCommonGateway,
} from "../../../sharing-common/services/sharing.gateway";
@CommandHandler(RevokeSharedItemCommand)
export class RevokeSharedItemCommandHandler
  implements ICommandHandler<RevokeSharedItemCommand>
{
  constructor(
    private readonly itemGroupsGetter: ItemGroupsGetterService,
    private readonly sharingSync: SharingSyncService,
    private readonly commonGateway: SharingCommonGateway
  ) {}
  async execute({ body }: RevokeSharedItemCommand) {
    const { revision, itemGroupId, userLogins, userGroupIds } =
      await this.getItemGroup(body);
    const result = await this.commonGateway.revokeItemGroupMembers({
      revision,
      itemGroupId,
      userLogins,
      userGroupIds,
    });
    if (isFailure(result)) {
      if (result.error.tag === ITEM_GROUP_MEMBER_INVALID_REVISION) {
        await this.sharingSync.scheduleSync();
        const { revision: revisionRetry, itemGroupId: groupIdRetry } =
          await this.getItemGroup(body);
        await this.commonGateway.revokeItemGroupMembers({
          revision: revisionRetry,
          itemGroupId: groupIdRetry,
          userLogins,
          userGroupIds,
        });
        return success(undefined);
      } else {
        throw new Error("Revoke shared item failed after retry attempt");
      }
    }
    await this.sharingSync.scheduleSync();
    return success(undefined);
  }
  private async getItemGroup(body: RevokeSharedItemCommandParam) {
    const { vaultItemId, recipient } = body;
    const itemGroupIdResult = await firstValueFrom(
      this.itemGroupsGetter.getForItemId(vaultItemId)
    );
    if (isFailure(itemGroupIdResult)) {
      throw new Error("Failed to execute item group getter");
    }
    if (!itemGroupIdResult.data) {
      throw new Error(`Failed to retrieve item group to revoke share item`);
    }
    const { groupId, revision } = itemGroupIdResult.data;
    const userLogins =
      recipient.type === RecipientTypes.User ? [recipient.alias] : undefined;
    const userGroupIds =
      recipient.type === RecipientTypes.Group ? [recipient.groupId] : undefined;
    return {
      revision,
      itemGroupId: groupId,
      userLogins,
      userGroupIds,
    };
  }
}
