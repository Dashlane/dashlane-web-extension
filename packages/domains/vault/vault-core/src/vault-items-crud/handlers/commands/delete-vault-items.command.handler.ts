import {
  CommandHandler,
  CommandHandlerResponseOf,
  ICommandHandler,
} from "@dashlane/framework-application";
import { Trigger } from "@dashlane/hermes";
import { failure, isSuccess, success } from "@dashlane/framework-types";
import { CarbonLegacyClient } from "@dashlane/communication";
import { DeleteVaultItemsCommand } from "@dashlane/vault-contracts";
import { SyncClient } from "@dashlane/sync-contracts";
import { VaultItemsCommandEventsEmitter } from "../events/events-emitter";
@CommandHandler(DeleteVaultItemsCommand)
export class DeleteVaultItemsCommandHandler
  implements ICommandHandler<DeleteVaultItemsCommand>
{
  constructor(
    private carbonLegacyClient: CarbonLegacyClient,
    private eventEmitter: VaultItemsCommandEventsEmitter,
    private syncClient: SyncClient
  ) {}
  async execute({
    body,
  }: DeleteVaultItemsCommand): CommandHandlerResponseOf<DeleteVaultItemsCommand> {
    const { vaultItemType, ids, ignoreSharing } = body;
    const { commands } = this.carbonLegacyClient;
    const successfulDeletionIds: string[] = [];
    const resultPromises = ids.map((id) =>
      commands
        .carbonLegacyLeeloo({
          name: "removePersonalDataItem",
          arg: [
            {
              id,
              ignoreSharing: !!ignoreSharing,
            },
          ],
        })
        .then((result) => {
          if (isSuccess(result)) {
            successfulDeletionIds.push(id);
          }
        })
    );
    await Promise.allSettled(resultPromises);
    if (successfulDeletionIds.length > 0) {
      this.eventEmitter.sendEvent("deleted", {
        ids: successfulDeletionIds,
        vaultItemType,
      });
    }
    await commands.removeItemsFromCollections({ ids });
    if (successfulDeletionIds.length !== ids.length) {
      return Promise.resolve(
        failure({
          tag: "error",
          errorMessage: `Error: Failed to delete all ${vaultItemType}s`,
          failedDeletionIds: ids.filter(
            (id: string) => !successfulDeletionIds.includes(id)
          ),
        })
      );
    }
    await this.syncClient.commands.sync({ trigger: Trigger.Save });
    return Promise.resolve(success(undefined));
  }
}
