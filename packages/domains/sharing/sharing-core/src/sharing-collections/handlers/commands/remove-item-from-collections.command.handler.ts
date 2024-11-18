import { firstValueFrom } from "rxjs";
import {
  CommandHandler,
  ICommandHandler,
} from "@dashlane/framework-application";
import { FeatureFlipsClient } from "@dashlane/framework-contracts";
import {
  getSuccess,
  isFailure,
  isSuccess,
  mapSuccessObservable,
  success,
} from "@dashlane/framework-types";
import {
  RemoveItemFromCollectionsCommand,
  ShareableItemType,
  SharingItemsClient,
} from "@dashlane/sharing-contracts";
import { ParsedURL } from "@dashlane/url-parser";
import { VaultItemsCrudClient, VaultItemType } from "@dashlane/vault-contracts";
import { AuditLogData, SharingSyncService } from "../../../sharing-common";
import { CurrentSpaceGetterService } from "../../../sharing-carbon-helpers";
import { SharingCollectionsGateway } from "../common/sharing-collections.gateway";
@CommandHandler(RemoveItemFromCollectionsCommand)
export class RemoveItemFromCollectionsCommandHandler
  implements ICommandHandler<RemoveItemFromCollectionsCommand>
{
  constructor(
    private readonly sharingCollectionsGateway: SharingCollectionsGateway,
    private readonly sharingSync: SharingSyncService,
    private readonly currentSpaceGetter: CurrentSpaceGetterService,
    private readonly featureFlips: FeatureFlipsClient,
    private readonly vaultItemsCrudClient: VaultItemsCrudClient,
    private readonly sharingItemsClient: SharingItemsClient
  ) {}
  async prepareAuditLogDetails(
    itemId: string
  ): Promise<AuditLogData | undefined> {
    const { userFeatureFlips } = this.featureFlips.queries;
    const featureFlipResult = await firstValueFrom(
      userFeatureFlips().pipe(
        mapSuccessObservable(
          (ff) => ff["audit_logs_sharing"] && ff["send_activity_log"]
        )
      )
    );
    const areAuditLogsEnabled = isSuccess(featureFlipResult)
      ? featureFlipResult.data ?? false
      : false;
    const currentSpaceResult = await firstValueFrom(
      this.currentSpaceGetter.get()
    );
    if (isFailure(currentSpaceResult)) {
      throw new Error(
        "Error fetching current space when moving shared collection items to business space"
      );
    }
    const captureLog = currentSpaceResult.data.areSensitiveLogsEnabled;
    if (!captureLog || !areAuditLogsEnabled) {
      return undefined;
    }
    const vaultItemsResult = await firstValueFrom(
      this.vaultItemsCrudClient.queries.query({
        vaultItemTypes: [VaultItemType.Credential],
        ids: [itemId],
      })
    );
    if (isFailure(vaultItemsResult)) {
      throw new Error("Unable to find selected item");
    }
    const vaultItems = getSuccess(vaultItemsResult);
    const credential = vaultItems.credentialsResult.matchCount
      ? vaultItems.credentialsResult.items[0]
      : undefined;
    const url = credential ? new ParsedURL(credential.URL).getRootDomain() : "";
    const domain = credential ? url : undefined;
    return {
      domain,
      type: credential
        ? ShareableItemType.Credential
        : ShareableItemType.SecureNote,
    };
  }
  async removeItemToCollection(itemId: string, collectionId: string) {
    const sharedItemResult = await firstValueFrom(
      this.sharingItemsClient.queries.getSharedItemForId({ itemId })
    );
    if (isFailure(sharedItemResult) || !sharedItemResult.data.sharedItem) {
      throw new Error(
        "Item group to be removed from collection cannot be found"
      );
    }
    const { sharedItemId, revision } = sharedItemResult.data.sharedItem;
    const auditLogData = await this.prepareAuditLogDetails(itemId);
    await this.sharingCollectionsGateway.removeItemGroupCollectionAccess({
      collectionId,
      itemGroupId: sharedItemId,
      itemGroupRevision: revision,
      auditLogData,
    });
  }
  async execute({ body }: RemoveItemFromCollectionsCommand) {
    const { collectionIds, itemId } = body;
    for (const collectionId of collectionIds) {
      await this.removeItemToCollection(itemId, collectionId);
    }
    await this.sharingSync.scheduleSync();
    return success(undefined);
  }
}
