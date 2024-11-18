import { firstValueFrom } from "rxjs";
import { Injectable } from "@dashlane/framework-application";
import {
  AnomalyCriticalityValues,
  ExceptionLoggingClient,
} from "@dashlane/framework-contracts";
import { isSuccess } from "@dashlane/framework-types";
import { SharedItem } from "@dashlane/sharing-contracts";
import {
  Credential,
  OperationType,
  Secret,
  SecureNote,
  VaultItemsCrudClient,
  VaultItemType,
  VaultOrganizationClient,
} from "@dashlane/vault-contracts";
import { SharingCommonGateway } from "../../../sharing-common/services/sharing.gateway";
import { SharingSyncVaultUpdatesService } from "./sharing-sync-vault-updates.service";
@Injectable()
export class SharingSyncLastAdminService {
  public constructor(
    private readonly vaultUpdatesService: SharingSyncVaultUpdatesService,
    private readonly sharingCommonGateway: SharingCommonGateway,
    private readonly vaultItemsCrudClient: VaultItemsCrudClient,
    private readonly vaultOrganizationClient: VaultOrganizationClient,
    private readonly exceptionLoggingClient: ExceptionLoggingClient
  ) {}
  public async deleteLastAdminSharedItem(sharedItem: SharedItem) {
    let vaultItemType: VaultItemType;
    let content: Partial<Credential | Secret | SecureNote>;
    const vaultItem = await this.vaultUpdatesService.getVaultItemsPerType([
      sharedItem.itemId,
    ]);
    if (vaultItem.credentialsResult.matchCount) {
      vaultItemType = VaultItemType.Credential;
      const { id, ...itemContent } = vaultItem.credentialsResult.items[0];
      content = itemContent;
    } else if (vaultItem.secureNotesResult.matchCount) {
      vaultItemType = VaultItemType.SecureNote;
      const { id, ...itemContent } = vaultItem.secureNotesResult.items[0];
      content = itemContent;
    } else if (vaultItem.secretsResult.matchCount) {
      vaultItemType = VaultItemType.Secret;
      const { id, ...itemContent } = vaultItem.secretsResult.items[0];
      content = itemContent;
    } else {
      return;
    }
    const createVaultItem =
      await this.vaultItemsCrudClient.commands.createVaultItem({
        vaultItemType,
        content,
        shouldSkipSync: false,
      });
    if (!isSuccess(createVaultItem)) {
      return;
    }
    const deleteItemGroupResult =
      await this.sharingCommonGateway.deleteItemGroup({
        groupId: sharedItem.sharedItemId,
        revision: sharedItem.revision,
      });
    if (!isSuccess(deleteItemGroupResult)) {
      this.exceptionLoggingClient.commands.reportAnomaly({
        criticality: AnomalyCriticalityValues.CRITICAL,
        message:
          "Error when trying to delete an item group during the unshare item process",
        moduleName: "SharingSyncModule",
        useCaseName: "sharing-sync-last-admin.service",
        applicationComponent: "Sharing",
        anomalyType: "exception",
        origin: "uncaughtException",
      });
      await this.vaultItemsCrudClient.commands.deleteVaultItems({
        ids: [createVaultItem.data.id],
        vaultItemType,
      });
      return;
    }
    const collectionsResult = await firstValueFrom(
      this.vaultOrganizationClient.queries.queryCollections({})
    );
    await this.vaultItemsCrudClient.commands.deleteVaultItems({
      ids: [sharedItem.itemId],
      vaultItemType,
      ignoreSharing: true,
    });
    if (
      isSuccess(collectionsResult) &&
      collectionsResult.data.collections.length > 0
    ) {
      const collectionsToUpdate = collectionsResult.data.collections.filter(
        (collection) =>
          collection.vaultItems.some(
            (vaultItemInCollection) =>
              vaultItemInCollection.id === sharedItem.itemId
          )
      );
      const collectionRemovals = {
        vaultItems: [
          {
            id: sharedItem.itemId,
            type: VaultItemType.Credential,
          },
        ],
      };
      const collectionAdditions = {
        vaultItems: [
          {
            id: createVaultItem.data.id,
            type: VaultItemType.Credential,
          },
        ],
      };
      for (const collectionToUpdate of collectionsToUpdate) {
        await this.vaultOrganizationClient.commands.updateCollection({
          id: collectionToUpdate.id,
          collection: collectionRemovals,
          operationType: OperationType.SUBSTRACT_VAULT_ITEMS,
        });
        await this.vaultOrganizationClient.commands.updateCollection({
          id: collectionToUpdate.id,
          collection: collectionAdditions,
          operationType: OperationType.APPEND_VAULT_ITEMS,
        });
      }
    }
  }
}
