import { firstValueFrom } from "rxjs";
import {
  CommandHandler,
  ICommandHandler,
} from "@dashlane/framework-application";
import {
  SharingItemsClient,
  UpdatePermissionForCollectionItemCommand,
} from "@dashlane/sharing-contracts";
import { isFailure, success } from "@dashlane/framework-types";
import { SharingSyncService } from "../../../sharing-common";
import { SharingCommonGateway } from "../../../sharing-common/services/sharing.gateway";
@CommandHandler(UpdatePermissionForCollectionItemCommand)
export class UpdateItemPermissionsInCollectionsCommandHandler
  implements ICommandHandler<UpdatePermissionForCollectionItemCommand>
{
  constructor(
    private readonly sharingCommon: SharingCommonGateway,
    private readonly sharingSync: SharingSyncService,
    private readonly sharingItemsClient: SharingItemsClient
  ) {}
  async execute({ body }: UpdatePermissionForCollectionItemCommand) {
    const { collection, itemId } = body;
    const sharedItemResult = await firstValueFrom(
      this.sharingItemsClient.queries.getSharedItemForId({ itemId })
    );
    if (isFailure(sharedItemResult) || !sharedItemResult.data.sharedItem) {
      throw new Error(
        "Item group to be removed from collection cannot be found"
      );
    }
    const { sharedItemId, revision } = sharedItemResult.data.sharedItem;
    await this.sharingCommon.updateItemGroupMembers({
      groupId: sharedItemId,
      collections: [
        {
          collectionUUID: collection.collectionId,
          permission: collection.permission,
        },
      ],
      revision: revision,
    });
    await this.sharingSync.scheduleSync();
    return success(undefined);
  }
}
