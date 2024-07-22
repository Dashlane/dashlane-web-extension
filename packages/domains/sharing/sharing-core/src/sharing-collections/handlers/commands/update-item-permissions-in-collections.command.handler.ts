import { firstValueFrom } from "rxjs";
import {
  CommandHandler,
  ICommandHandler,
} from "@dashlane/framework-application";
import { UpdatePermissionForCollectionItemCommand } from "@dashlane/sharing-contracts";
import { isFailure, success } from "@dashlane/framework-types";
import { SharingSyncService } from "../../../sharing-common";
import { ItemGroupsGetterService } from "../../../sharing-carbon-helpers";
import { SharingCommonGateway } from "../../../sharing-common/services/sharing.gateway";
@CommandHandler(UpdatePermissionForCollectionItemCommand)
export class UpdateItemPermissionsInCollectionsCommandHandler
  implements ICommandHandler<UpdatePermissionForCollectionItemCommand>
{
  constructor(
    private readonly itemGroupsGetter: ItemGroupsGetterService,
    private readonly sharingCommon: SharingCommonGateway,
    private readonly sharingSync: SharingSyncService
  ) {}
  async execute({ body }: UpdatePermissionForCollectionItemCommand) {
    const { collection, groupId } = body;
    const itemGroup = await firstValueFrom(
      this.itemGroupsGetter.getForItemGroupId(groupId)
    );
    if (isFailure(itemGroup) || !itemGroup.data) {
      throw new Error("Item group to remove cannot be found");
    }
    await this.sharingCommon.updateItemGroupMembers({
      groupId: groupId,
      collections: [
        {
          collectionUUID: collection.collectionId,
          permission: collection.permission,
        },
      ],
      revision: itemGroup.data.revision,
    });
    await this.sharingSync.scheduleSync();
    return success(undefined);
  }
}
