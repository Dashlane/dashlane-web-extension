import { firstValueFrom } from "rxjs";
import {
  CommandHandler,
  ICommandHandler,
} from "@dashlane/framework-application";
import { ServerApiClient } from "@dashlane/framework-dashlane-application";
import { getSuccess, isFailure, success } from "@dashlane/framework-types";
import { RefuseSharedItemCommand } from "@dashlane/sharing-contracts";
import { ItemGroupsGetterService } from "../../../sharing-carbon-helpers";
@CommandHandler(RefuseSharedItemCommand)
export class RefuseSharedItemCommandHandler
  implements ICommandHandler<RefuseSharedItemCommand>
{
  constructor(
    private serverApiClient: ServerApiClient,
    private itemGroupsGetter: ItemGroupsGetterService
  ) {}
  async execute({ body }: RefuseSharedItemCommand) {
    const { vaultItemId } = body;
    const itemGroupResult = await firstValueFrom(
      this.itemGroupsGetter.getForItemId(vaultItemId)
    );
    if (isFailure(itemGroupResult)) {
      throw new Error(
        `Failed to retrieve item group for pending item group with`
      );
    }
    const itemGroup = getSuccess(itemGroupResult);
    if (itemGroup === undefined) {
      throw new Error(
        `Failed to retrieve item group for pending item group with`
      );
    }
    await firstValueFrom(
      this.serverApiClient.v1.sharingUserdevice.refuseItemGroup({
        groupId: itemGroup.groupId,
        revision: itemGroup.revision,
      })
    );
    return success(undefined);
  }
}
