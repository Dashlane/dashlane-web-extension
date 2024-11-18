import { firstValueFrom } from "rxjs";
import {
  failure,
  getFailure,
  getSuccess,
  isFailure,
  isObject,
  isSuccess,
  success,
} from "@dashlane/framework-types";
import {
  CommandHandler,
  type ICommandHandler,
} from "@dashlane/framework-application";
import {
  CarbonLegacyClient,
  deleteVaultModuleItemFailureReason,
} from "@dashlane/communication";
import { SyncClient } from "@dashlane/sync-contracts";
import {
  createItemNotFoundError,
  DeleteVaultItemCommand,
  VaultItemType,
} from "@dashlane/vault-contracts";
import {
  isSharedVaultItemType,
  SharingItemsClient,
} from "@dashlane/sharing-contracts";
import { Trigger } from "@dashlane/hermes";
import {
  ActivityLogsClient,
  ActivityLogType,
} from "@dashlane/risk-monitoring-contracts";
import { TeamPlanDetailsClient } from "@dashlane/team-admin-contracts";
import { ExceptionLoggingClient } from "@dashlane/framework-contracts";
import { ParsedURL } from "@dashlane/url-parser";
import { VaultItemsCommandEventsEmitter } from "../events/events-emitter";
import { VaultRepository } from "../../../vault-repository";
import { createActivityLog } from "../../../vault-organization/utils/activity-logs";
interface CarbonAPICommandErrorResult {
  success: false;
  error: object;
}
const isCarbonCommandErrorResult = (
  x: unknown
): x is CarbonAPICommandErrorResult => {
  return (
    isObject(x) &&
    "success" in x &&
    x.success === false &&
    "error" in x &&
    isObject(x.error)
  );
};
const getCarbonCommandError = (result: CarbonAPICommandErrorResult) => {
  return result.error;
};
const getCarbonCommandErrorReason = (
  error: ReturnType<typeof getCarbonCommandError>
) => {
  return "reason" in error && typeof error.reason === "string"
    ? error.reason
    : null;
};
@CommandHandler(DeleteVaultItemCommand)
export class DeleteVaultItemCommandHandler
  implements ICommandHandler<DeleteVaultItemCommand>
{
  constructor(
    private carbonLegacyClient: CarbonLegacyClient,
    private eventEmitter: VaultItemsCommandEventsEmitter,
    private syncClient: SyncClient,
    private vaultRepository: VaultRepository,
    private sharingItemsClient: SharingItemsClient,
    private teamPlanDetailsClient: TeamPlanDetailsClient,
    private activityLogs: ActivityLogsClient,
    private anomalyReporter: ExceptionLoggingClient
  ) {}
  async execute({ body }: DeleteVaultItemCommand) {
    const { vaultItemType, id, ignoreSharing = false } = body;
    const { notFound } = await this.vaultRepository.vaultItemsOfTypeExist(
      [id],
      vaultItemType
    );
    if (notFound.length > 0) {
      this.anomalyReporter.commands.reportAnomaly({
        criticality: "critical",
        message: `Vault item to delete could not be found`,
        moduleName: "VaultItemsCrudModule",
        useCaseName: "DeleteVaultItemCommand",
        applicationComponent: "",
        anomalyType: "other",
        additionalInfo: JSON.stringify({ vaultItemType }),
      });
      return failure(createItemNotFoundError());
    }
    if (!ignoreSharing) {
      if (isSharedVaultItemType(vaultItemType)) {
        try {
          const refuseSharedItemResult =
            await this.sharingItemsClient.commands.refuseSharedItemBeforeDeletion(
              {
                vaultItemId: id,
              }
            );
          if (isFailure(refuseSharedItemResult)) {
            throw new Error(
              "Unexpected failure returned by the sharing conditions check of the vault item to delete",
              { cause: { failure: getFailure(refuseSharedItemResult) } }
            );
          }
        } catch (err) {
          throw new Error(
            "Unexpected error occurred while handling sharing conditions of the vault item to delete",
            { cause: err }
          );
        }
      }
    }
    const result = await this.carbonLegacyClient.commands.deleteVaultModuleItem(
      {
        id,
        kwType: vaultItemType,
      }
    );
    if (isFailure(result)) {
      throw new Error(
        "Unexpected failure trying to delete vault item of type from Carbon",
        {
          cause: {
            failure: getFailure(result),
          },
        }
      );
    }
    const carbonSuccess = getSuccess(result);
    if (isCarbonCommandErrorResult(carbonSuccess)) {
      const carbonCommandError = getCarbonCommandError(carbonSuccess);
      const carbonDeletionErrorReason =
        getCarbonCommandErrorReason(carbonCommandError);
      if (
        carbonDeletionErrorReason ===
        deleteVaultModuleItemFailureReason.NOT_FOUND
      ) {
        this.anomalyReporter.commands.reportAnomaly({
          criticality: "warning",
          message: `Vault item to delete could not be found during Carbon deletion`,
          moduleName: "VaultItemsCrudModule",
          useCaseName: "DeleteVaultItemCommand",
          applicationComponent: "",
          anomalyType: "other",
          additionalInfo: JSON.stringify({ vaultItemType }),
        });
        return failure(createItemNotFoundError());
      }
      throw new Error(
        "Unexpected failure trying to delete vault item of type from Carbon",
        {
          cause: {
            vaultItemType,
            error: carbonCommandError,
            reason: carbonDeletionErrorReason,
          },
        }
      );
    }
    this.eventEmitter.sendEvent("deleted", {
      ids: [id],
      vaultItemType,
    });
    await this.carbonLegacyClient.commands.removeItemsFromCollections({
      ids: [id],
    });
    await this.syncClient.commands.sync({ trigger: Trigger.Save });
    const auditLogRelevant = vaultItemType === VaultItemType.Credential;
    if (auditLogRelevant) {
      try {
        const [teamIdResult, credentialToDelete] = await Promise.all([
          firstValueFrom(this.teamPlanDetailsClient.queries.getTeamId()),
          this.vaultRepository.getCredential(id),
        ]);
        if (
          isSuccess(teamIdResult) &&
          getSuccess(teamIdResult).teamId === credentialToDelete.SpaceId
        ) {
          const activityLog = createActivityLog(
            ActivityLogType.UserDeletedCredential,
            {
              domain_url: new ParsedURL(credentialToDelete.Url).getRootDomain(),
            }
          );
          this.activityLogs.commands.storeActivityLogs({
            activityLogs: [activityLog],
          });
        }
      } catch (e) {
        this.anomalyReporter.commands.reportAnomaly({
          criticality: "critical",
          message: `Couldn't send activity log for credential deletion`,
          moduleName: "VaultItemsCrudModule",
          useCaseName: "DeleteVaultItemCommand",
          applicationComponent: "",
          anomalyType: "other",
          additionalInfo: String(e),
        });
      }
    }
    return success(undefined);
  }
}
