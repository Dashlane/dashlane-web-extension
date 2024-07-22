import { firstValueFrom } from "rxjs";
import { DeleteCollectionCommand } from "@dashlane/vault-contracts";
import {
  CommandHandler,
  CommandHandlerResponseOf,
  ICommandHandler,
} from "@dashlane/framework-application";
import { CarbonLegacyClient } from "@dashlane/communication";
import { isFailure, success } from "@dashlane/framework-types";
import { CollectionAction } from "@dashlane/hermes";
import {
  ActivityLogsClient,
  ActivityLogType,
} from "@dashlane/risk-monitoring-contracts";
import { fetchCollections } from "../../data-fetching-helper";
import { sendUserUpdateCollectionEvent } from "../../log-helper";
import { createActivityLog } from "../../utils/activity-logs";
@CommandHandler(DeleteCollectionCommand)
export class DeleteCollectionCommandHandler
  implements ICommandHandler<DeleteCollectionCommand>
{
  constructor(
    private carbonLegacyClient: CarbonLegacyClient,
    private activityLogs: ActivityLogsClient
  ) {}
  async execute({
    body,
  }: DeleteCollectionCommand): CommandHandlerResponseOf<DeleteCollectionCommand> {
    const { id, name = "" } = body;
    const collectionToDeleteResult = await firstValueFrom(
      fetchCollections(this.carbonLegacyClient, [id])
    );
    if (isFailure(collectionToDeleteResult)) {
      throw new Error(
        `Failed to fetch additional collection info: ${collectionToDeleteResult.error}`
      );
    }
    const deleteCollectionResult =
      await this.carbonLegacyClient.commands.carbon({
        name: "deleteCollection",
        args: [{ id }],
      });
    if (isFailure(deleteCollectionResult)) {
      throw new Error(
        `Failed to delete collection: ${deleteCollectionResult.error}`
      );
    }
    sendUserUpdateCollectionEvent(
      this.carbonLegacyClient,
      CollectionAction.Delete,
      id,
      collectionToDeleteResult.data.collections[0]?.vaultItems?.length
    );
    const logPayload = { collection_name: name };
    const activityLog = createActivityLog(
      ActivityLogType.UserDeletedCollection,
      logPayload
    );
    this.activityLogs.commands.storeActivityLogs({
      activityLogs: [activityLog],
    });
    return Promise.resolve(success(undefined));
  }
}
