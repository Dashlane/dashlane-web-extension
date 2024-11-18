import { firstValueFrom, identity } from "rxjs";
import {
  CommandHandler,
  ICommandHandler,
} from "@dashlane/framework-application";
import { failure, matchResult, success } from "@dashlane/framework-types";
import {
  createForbiddenGroupItemError,
  createForbiddenLastAdminError,
  GetIsLastAdminForItemQuery,
  GetSharingStatusForItemQuery,
  RefuseSharedItemBeforeDeletionCommand,
} from "@dashlane/sharing-contracts";
import {
  GetIsLastAdminForItemQueryHandler,
  GetSharingStatusForItemQueryHandler,
} from "../queries";
import { SharedItemsService } from "../common/shared-items.service";
@CommandHandler(RefuseSharedItemBeforeDeletionCommand)
export class RefuseSharedItemBeforeDeletionCommandHandler
  implements ICommandHandler<RefuseSharedItemBeforeDeletionCommand>
{
  constructor(
    private readonly sharingStatusForItemQueryHandler: GetSharingStatusForItemQueryHandler,
    private readonly getIsLastAdminForItemQueryHandler: GetIsLastAdminForItemQueryHandler,
    private readonly sharedItemsService: SharedItemsService
  ) {}
  async execute({ body }: RefuseSharedItemBeforeDeletionCommand) {
    const { vaultItemId } = body;
    const itemSharingStatusResult = await firstValueFrom(
      this.sharingStatusForItemQueryHandler.execute(
        new GetSharingStatusForItemQuery({ itemId: vaultItemId })
      )
    );
    const { isSharedViaUserGroup, isShared } = matchResult(
      itemSharingStatusResult,
      {
        success: identity,
        failure: (sharingStatusFailure) => {
          throw new Error(
            "Unexpected failure while attempting to retrieve sharing status of item to be deleted",
            {
              cause: { failure: sharingStatusFailure },
            }
          );
        },
      }
    );
    if (!isShared) {
      return success(undefined);
    }
    if (isSharedViaUserGroup) {
      return failure(createForbiddenGroupItemError());
    }
    const isLastAdminForItemResult = await firstValueFrom(
      this.getIsLastAdminForItemQueryHandler.execute(
        new GetIsLastAdminForItemQuery({
          itemId: vaultItemId,
        })
      )
    );
    const { isLastAdmin } = matchResult(isLastAdminForItemResult, {
      success: identity,
      failure: (isLastAdminForItemFailure) => {
        throw new Error(
          "Unexpected failure while attempting to determine if we're the last admin of shared item to be deleted",
          {
            cause: { failure: isLastAdminForItemFailure },
          }
        );
      },
    });
    if (isLastAdmin) {
      return failure(createForbiddenLastAdminError());
    }
    await this.sharedItemsService.refuseSharedItem(vaultItemId);
    return success(undefined);
  }
}
