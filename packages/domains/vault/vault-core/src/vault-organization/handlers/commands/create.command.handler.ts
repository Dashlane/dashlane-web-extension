import { Client } from "@dashlane/framework-contracts";
import { CarbonLegacyClient, CarbonModuleApi } from "@dashlane/communication";
import { CollectionAction } from "@dashlane/hermes";
import {
  CommandHandler,
  CommandHandlerResponseOf,
  ICommandHandler,
} from "@dashlane/framework-application";
import { CreateCollectionCommand } from "@dashlane/vault-contracts";
import { isFailure, success } from "@dashlane/framework-types";
import {
  ActivityLogsClient,
  ActivityLogType,
} from "@dashlane/risk-monitoring-contracts";
import { sendUserUpdateCollectionEvent } from "../../log-helper";
import { isCarbonCreationCollectionResultId } from "./creation-guard";
import { createActivityLog } from "../../utils/activity-logs";
@CommandHandler(CreateCollectionCommand)
export class CreateCollectionCommandHandler
  implements ICommandHandler<CreateCollectionCommand>
{
  private carbonLegacy: Client<
    CarbonModuleApi["commands"],
    CarbonModuleApi["queries"]
  >;
  public constructor(
    private activityLogs: ActivityLogsClient,
    carbonLegacyClient: CarbonLegacyClient
  ) {
    this.activityLogs = activityLogs;
    this.carbonLegacy = carbonLegacyClient;
  }
  async execute({
    body,
  }: CreateCollectionCommand): CommandHandlerResponseOf<CreateCollectionCommand> {
    const {
      content: { name, spaceId = "", vaultItems = [] },
    } = body;
    const createCollectionResult = await this.carbonLegacy.commands.carbon({
      name: "addCollection",
      args: [{ name, spaceId, vaultItems }],
    });
    if (isFailure(createCollectionResult)) {
      throw new Error(
        `Failed to create collection: ${createCollectionResult.error}`
      );
    } else if (
      !isCarbonCreationCollectionResultId(
        createCollectionResult.data.carbonResult
      )
    ) {
      throw new Error(`Failed to find created collection id`);
    }
    if (spaceId) {
      const activityLogs = [
        createActivityLog(ActivityLogType.UserCreatedCollection, {
          collection_name: name,
        }),
      ];
      this.activityLogs.commands.storeActivityLogs({ activityLogs });
    }
    sendUserUpdateCollectionEvent(
      this.carbonLegacy,
      CollectionAction.Add,
      createCollectionResult.data.carbonResult.id,
      vaultItems.length
    );
    if (vaultItems.length) {
      sendUserUpdateCollectionEvent(
        this.carbonLegacy,
        CollectionAction.AddCredential,
        createCollectionResult.data.carbonResult.id,
        vaultItems.length
      );
    }
    return success({ id: createCollectionResult.data.id });
  }
}
