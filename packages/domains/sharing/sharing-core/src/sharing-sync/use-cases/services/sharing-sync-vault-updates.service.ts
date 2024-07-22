import { firstValueFrom } from "rxjs";
import { Injectable } from "@dashlane/framework-application";
import { RevisionSummary, SharedItem } from "@dashlane/sharing-contracts";
import { VaultItemsCrudClient, VaultItemType } from "@dashlane/vault-contracts";
import {
  CarbonLegacyClient,
  Credential,
  Note,
  Secret,
} from "@dashlane/communication";
import { getSuccess, isFailure, safeCast } from "@dashlane/framework-types";
import { ItemContent } from "@dashlane/server-sdk/v1";
import { SharingDecryptionService } from "../../..";
@Injectable()
export class SharingSyncVaultUpdatesService {
  constructor(
    private sharingDecryption: SharingDecryptionService,
    private vaultItemsCrudClient: VaultItemsCrudClient,
    private carbonLegacyClient: CarbonLegacyClient
  ) {}
  public async runVaultUpdates(
    updatedItems: ItemContent[],
    newSharedItemsIndex: Record<string, SharedItem>
  ) {
    const decryptedItemsWithRevisions = await Promise.all(
      updatedItems.map(async (item) => {
        const sharedItem = newSharedItemsIndex[item.itemId];
        if (!sharedItem) {
          return null;
        }
        const itemToSave = await this.decryptItemContent(
          sharedItem,
          item.content
        );
        return { id: item.itemId, revision: item.timestamp, itemToSave };
      })
    );
    const { itemRevisions, itemsToSave } = decryptedItemsWithRevisions.reduce(
      (acc, entry) => {
        if (entry) {
          if (entry.itemToSave) {
            acc.itemsToSave.push(entry.itemToSave);
          }
          const { id, revision } = entry;
          acc.itemRevisions.push({ id, revision });
        }
        return acc;
      },
      {
        itemRevisions: safeCast<RevisionSummary[]>([]),
        itemsToSave: safeCast<Array<Credential | Note | Secret>>([]),
      }
    );
    const result =
      await this.carbonLegacyClient.commands.saveSharedItemsToVault({
        items: itemsToSave,
      });
    if (isFailure(result)) {
      return null;
    }
    return itemRevisions;
  }
  public decryptItemContent(sharedItem: SharedItem, itemContent: string) {
    return this.sharingDecryption.decryptSharedItemContent(
      sharedItem,
      itemContent
    );
  }
  private async getVaultItemsPerType(itemIds: string[]) {
    const vaultItemsResult = await firstValueFrom(
      this.vaultItemsCrudClient.queries.query({
        vaultItemTypes: [
          VaultItemType.Credential,
          VaultItemType.Secret,
          VaultItemType.SecureNote,
        ],
        ids: itemIds,
      })
    );
    if (isFailure(vaultItemsResult)) {
      throw new Error("Could not access the vault items to run sharing sync");
    }
    return getSuccess(vaultItemsResult);
  }
  public async deleteVaultItems(deletedItemIds: string[]) {
    const vaultItems = await this.getVaultItemsPerType(deletedItemIds);
    if (vaultItems.credentialsResult.matchCount) {
      this.vaultItemsCrudClient.commands.deleteVaultItems({
        vaultItemType: VaultItemType.Credential,
        ids: vaultItems.credentialsResult.items.map((item) => item.id),
      });
    }
    if (vaultItems.secureNotesResult.matchCount) {
      this.vaultItemsCrudClient.commands.deleteVaultItems({
        vaultItemType: VaultItemType.SecureNote,
        ids: vaultItems.secureNotesResult.items.map((item) => item.id),
      });
    }
    if (vaultItems.secretsResult.matchCount) {
      this.vaultItemsCrudClient.commands.deleteVaultItems({
        vaultItemType: VaultItemType.Secret,
        ids: vaultItems.secretsResult.items.map((item) => item.id),
      });
    }
  }
}
