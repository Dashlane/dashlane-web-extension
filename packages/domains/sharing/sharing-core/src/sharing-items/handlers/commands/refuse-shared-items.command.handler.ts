import {
  CommandHandler,
  type ICommandHandler,
} from "@dashlane/framework-application";
import { success } from "@dashlane/framework-types";
import { RefuseSharedItemCommand } from "@dashlane/sharing-contracts";
import { SharedItemsService } from "../common/shared-items.service";
@CommandHandler(RefuseSharedItemCommand)
export class RefuseSharedItemCommandHandler
  implements ICommandHandler<RefuseSharedItemCommand>
{
  constructor(private readonly sharedItemsService: SharedItemsService) {}
  async execute({ body }: RefuseSharedItemCommand) {
    await this.sharedItemsService.refuseSharedItem(body.vaultItemId);
    return success(undefined);
  }
}
