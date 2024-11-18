import { firstValueFrom } from "rxjs";
import {
  CommandHandler,
  type ICommandHandler,
} from "@dashlane/framework-application";
import { isFailure, success } from "@dashlane/framework-types";
import {
  RecipientTypes,
  UpdateSharedItemPermissionCommand,
  UpdateSharedItemPermissionCommandParam,
} from "@dashlane/sharing-contracts";
import { SharingSyncService } from "../../../sharing-common";
import {
  ITEM_GROUP_MEMBER_INVALID_REVISION,
  SharingCommonGateway,
} from "../../../sharing-common/services/sharing.gateway";
import { SharedItemsRepository } from "../common/shared-items-repository";
@CommandHandler(UpdateSharedItemPermissionCommand)
export class UpdateSharedItemPermissionCommandHandler
  implements ICommandHandler<UpdateSharedItemPermissionCommand>
{
  constructor(
    private readonly sharingSync: SharingSyncService,
    private readonly commonGateway: SharingCommonGateway,
    private readonly sharedItemRepository: SharedItemsRepository
  ) {}
  async execute({ body }: UpdateSharedItemPermissionCommand) {
    const { sharedItemId, revision, users, groups } = await this.getItemGroup(
      body
    );
    const result = await this.commonGateway.updateItemGroupMembers({
      groupId: sharedItemId,
      revision,
      users,
      groups,
    });
    if (isFailure(result)) {
      if (result.error.tag === ITEM_GROUP_MEMBER_INVALID_REVISION) {
        await this.sharingSync.scheduleSync();
        const { sharedItemId: sharedItemIdRetry, revision: revisionRetry } =
          await this.getItemGroup(body);
        await this.commonGateway.updateItemGroupMembers({
          groupId: sharedItemIdRetry,
          revision: revisionRetry,
          users,
          groups,
        });
        return success(undefined);
      } else {
        throw new Error("Revoke shared item failed after retry attempt");
      }
    }
    await this.sharingSync.scheduleSync();
    return success(undefined);
  }
  private async getItemGroup(body: UpdateSharedItemPermissionCommandParam) {
    const { vaultItemId, recipient, permission } = body;
    const sharedItem = await firstValueFrom(
      this.sharedItemRepository.sharedItemForId$(vaultItemId)
    );
    if (!sharedItem) {
      throw new Error(`Failed to retrieve item group to revoke share item`);
    }
    const { sharedItemId, revision } = sharedItem;
    const users =
      recipient.type === RecipientTypes.User
        ? [
            {
              userId: recipient.alias,
              permission: permission,
            },
          ]
        : undefined;
    const groups =
      recipient.type === RecipientTypes.Group
        ? [
            {
              groupId: recipient.groupId,
              permission: permission,
            },
          ]
        : undefined;
    return { sharedItemId, revision, users, groups };
  }
}
