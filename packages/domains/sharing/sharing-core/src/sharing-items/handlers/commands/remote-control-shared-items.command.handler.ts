import { filter, firstValueFrom, map, tap, timeout } from "rxjs";
import {
  AllowedToFail,
  CommandHandler,
  ICommandHandler,
} from "@dashlane/framework-application";
import {
  getSuccess,
  isFailure,
  isSuccess,
  success,
} from "@dashlane/framework-types";
import { CarbonLegacyClient } from "@dashlane/communication";
import { SessionClient } from "@dashlane/session-contracts";
import {
  Permission,
  RemoteControlSharedItemsCommand,
  SharedItem,
  SharingInvitesClient,
} from "@dashlane/sharing-contracts";
import { SharedItemsRepository } from "../common/shared-items-repository";
import { SharingCommonGateway } from "../../../sharing-common/services/sharing.gateway";
import { SharingSyncService } from "../../../sharing-common";
export const GET_CURRENT_SESSION_TIMEOUT = 3000;
const batchAsyncTasks = async (
  tasks: Array<() => Promise<unknown>>,
  batchSize = 2
) => {
  const _tasks = [...tasks];
  let completed = 0;
  while (_tasks.length) {
    const currentBatchTasks = _tasks.splice(0, batchSize);
    const currentBatchTasksPromise = currentBatchTasks.map((task) => task());
    const currentBatchTasksResults = await Promise.all(
      currentBatchTasksPromise
    );
    const currentBatchCompleted = currentBatchTasksResults.length;
    completed = completed + currentBatchCompleted;
  }
  return completed;
};
@CommandHandler(RemoteControlSharedItemsCommand)
export class RemoteControlSharedItemsCommandHandler
  implements ICommandHandler<RemoteControlSharedItemsCommand>
{
  constructor(
    private readonly sharedItemsRepository: SharedItemsRepository,
    private readonly commonGateway: SharingCommonGateway,
    private readonly carbonClient: CarbonLegacyClient,
    private readonly sessionClient: SessionClient,
    private readonly sharingSync: SharingSyncService,
    private readonly sharingInvitesClient: SharingInvitesClient,
    private readonly allowedToFail: AllowedToFail
  ) {}
  async execute(command: RemoteControlSharedItemsCommand) {
    const {
      body: { vaultItemIds, pendingInvitesIds, shouldRunSync },
    } = command;
    if (!vaultItemIds.length && !pendingInvitesIds.length) {
      if (shouldRunSync) {
        this.sharingSync.scheduleSync();
      }
      return success(undefined);
    }
    const login = await this.getCurrentUserLoginAfterGrapheneSessionOpening();
    const refusePendingInvitesTasks = pendingInvitesIds.map(
      (id) => () => this.refusePendingInvite(id)
    );
    const refusePendingInvitesTasksCompleted = await batchAsyncTasks(
      refusePendingInvitesTasks
    );
    const revokeSharedItemsTasks = await this.getRevokeSharedItemsTasks(
      login,
      vaultItemIds
    );
    const revokeSharedItemsTasksCompleted = await batchAsyncTasks(
      revokeSharedItemsTasks
    );
    const sharingChanges =
      refusePendingInvitesTasksCompleted > 0 ||
      revokeSharedItemsTasksCompleted > 0;
    if (shouldRunSync || sharingChanges) {
      this.sharingSync.scheduleSync();
    }
    return success(undefined);
  }
  private async refusePendingInvite(itemGroupId: string) {
    const {
      commands: { refuseItemGroupInvite },
    } = this.sharingInvitesClient;
    const result = await refuseItemGroupInvite({ itemGroupId });
    if (isFailure(result)) {
      throw new Error(
        "Failure to refuse pending invite for a force categorized item"
      );
    }
    return getSuccess(result);
  }
  private async getRevokeSharedItemsTasks(
    userLogin: string,
    vaultItemIds: string[]
  ) {
    if (!vaultItemIds.length) {
      return [];
    }
    const sharedItems = await firstValueFrom(
      this.sharedItemsRepository.sharedItemsForIds$(vaultItemIds)
    );
    return sharedItems.map(
      (item) => () => this.revokeSharedItem(item, userLogin)
    );
  }
  private async revokeSharedItem(
    {
      isLastAdmin,
      revision,
      recipientIds: { userIds, collectionIds, userGroupIds },
      sharedItemId,
      itemId,
      permission,
    }: SharedItem,
    userLogin: string
  ) {
    const userIdsExcludingMe = userIds?.filter((id) => id !== userLogin);
    if (isLastAdmin && (userIdsExcludingMe || collectionIds || userGroupIds)) {
      const result = await this.commonGateway.revokeItemGroupMembers({
        itemGroupId: sharedItemId,
        revision,
        userLogins: userIdsExcludingMe?.length ? userIdsExcludingMe : undefined,
        collectionIds: collectionIds ?? undefined,
        userGroupIds: userGroupIds ?? undefined,
      });
      if (isFailure(result)) {
        throw new Error("Revoke shared item failed in remote control");
      }
      await this.sharingSync.scheduleSync();
      return success(result);
    }
    const result = await this.commonGateway.refuseItemGroup({
      itemGroupId: sharedItemId,
      revision,
    });
    if (permission === Permission.Admin) {
      return this.duplicateVaultItem(itemId);
    } else {
      return result;
    }
  }
  private async duplicateVaultItem(vaultItemId: string) {
    const {
      commands: { duplicateVaultItem },
    } = this.carbonClient;
    const duplicationResult = await duplicateVaultItem({
      vaultItemId,
    });
    if (isFailure(duplicationResult)) {
      throw new Error(
        "Failed to duplicate a shared item that is revoked because of forced catgorization"
      );
    }
    return getSuccess(duplicationResult);
  }
  private async getCurrentUserLoginAfterGrapheneSessionOpening() {
    const loginAfterGrapheneSessionOpened = await firstValueFrom(
      this.sessionClient.queries.selectedOpenedSession().pipe(
        filter(isSuccess),
        map(getSuccess),
        tap((maybeLogin) => {
          if (!maybeLogin) {
            this.allowedToFail.doOne(() => {
              throw new Error(
                "Unexpected user login value for remote control of shared items"
              );
            });
          }
        }),
        filter(
          (value): value is string => typeof value === "string" && value !== ""
        ),
        timeout({
          first: GET_CURRENT_SESSION_TIMEOUT,
          with: () => {
            throw new Error(
              "Timeout retrieving user login after Graphene Session Opening for remote control of shared items"
            );
          },
        })
      )
    );
    return loginAfterGrapheneSessionOpened;
  }
}
