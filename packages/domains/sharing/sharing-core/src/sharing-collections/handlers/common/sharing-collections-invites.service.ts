import { firstValueFrom } from "rxjs";
import { Injectable } from "@dashlane/framework-application";
import {
  arrayBufferToText,
  base64ToArrayBuffer,
} from "@dashlane/framework-encoding";
import { isFailure } from "@dashlane/framework-types";
import { ActivityLogsClient } from "@dashlane/risk-monitoring-contracts";
import {
  Permission,
  ShareableItemType,
  SharedCollection,
  SharedItem,
} from "@dashlane/sharing-contracts";
import { VaultItemsCrudClient, VaultItemType } from "@dashlane/vault-contracts";
import { ParsedURL } from "@dashlane/url-parser";
import {
  SharingCryptographyService,
  SharingDecryptionService,
  SharingInvitesCryptoService,
} from "../../../sharing-crypto";
import { AddItemGroupsToCollectionModel } from "./types";
@Injectable()
export class SharingCollectionInvitesService {
  public constructor(
    private sharingInvitesCrypto: SharingInvitesCryptoService,
    private sharingCrypto: SharingCryptographyService,
    private sharingDecryption: SharingDecryptionService,
    private vaultItemsCrudClient: VaultItemsCrudClient,
    private activityLogs: ActivityLogsClient
  ) {}
  private async getDomainForCredential(itemId: string) {
    const vaultItems = await firstValueFrom(
      this.vaultItemsCrudClient.queries.query({
        vaultItemTypes: [VaultItemType.Credential],
        ids: [itemId],
      })
    );
    if (isFailure(vaultItems)) {
      throw new Error("Unable to find selected item");
    }
    const selectedVaultItem = vaultItems.data.credentialsResult.items[0];
    return new ParsedURL(selectedVaultItem.URL).getRootDomain();
  }
  public async createCollectionInvites(
    collection: SharedCollection,
    sharedItems: SharedItem[],
    defaultItemPermissions: Permission
  ): Promise<AddItemGroupsToCollectionModel> {
    const itemGroupParamObjects = await Promise.all(
      sharedItems.map(async (sharedItem) => {
        const clearItemGroupKey =
          await this.sharingDecryption.decryptItemGroupKey(sharedItem);
        if (clearItemGroupKey === null) {
          throw new Error("Unable to decrypt item group key");
        }
        const clearCollectionKey =
          await this.sharingDecryption.decryptCollectionKey(collection);
        if (clearCollectionKey === null) {
          throw new Error("Unable to decrypt collection key");
        }
        const clearCollectionPrivateKeyPemBuffer =
          await this.sharingCrypto.decryptSecureData(
            clearCollectionKey,
            base64ToArrayBuffer(collection.privateKey)
          );
        const { proposeSignature, acceptSignature, resourceKey } =
          await this.sharingInvitesCrypto.createSignedInvite(
            collection.uuid,
            { resourceKey: clearItemGroupKey, uuid: sharedItem.sharedItemId },
            collection.publicKey,
            arrayBufferToText(clearCollectionPrivateKeyPemBuffer)
          );
        if (!resourceKey) {
          throw new Error(
            "Could not create resource key when generating user group invite for collection"
          );
        }
        if (!acceptSignature) {
          throw new Error("should not happen");
        }
        const isLoggingEnabled = await firstValueFrom(
          this.activityLogs.queries.areSensitiveLogsEnabled()
        );
        if (isFailure(isLoggingEnabled)) {
          throw new Error("Unable find preferences");
        }
        const vaultItems = await firstValueFrom(
          this.vaultItemsCrudClient.queries.query({
            vaultItemTypes: [
              VaultItemType.Credential,
              VaultItemType.SecureNote,
            ],
            ids: [sharedItem.itemId],
          })
        );
        if (isFailure(vaultItems)) {
          throw new Error("Unable to find selected item");
        }
        const isItemCredential = vaultItems.data.credentialsResult.items.length;
        const auditLogData = isItemCredential
          ? {
              domain: await this.getDomainForCredential(sharedItem.itemId),
              type: ShareableItemType.Credential,
            }
          : undefined;
        return {
          id: sharedItem.sharedItemId,
          permission: defaultItemPermissions,
          resourceKey,
          proposeSignature,
          acceptSignature,
          auditLogData,
        };
      })
    );
    return {
      collectionId: collection.uuid,
      revision: collection.revision,
      itemGroups: itemGroupParamObjects,
    };
  }
}
