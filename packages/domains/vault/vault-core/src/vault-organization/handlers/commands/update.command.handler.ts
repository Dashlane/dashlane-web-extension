import { firstValueFrom } from "rxjs";
import {
  Collection,
  CollectionVaultItem,
  Credential,
  OperationType,
  SecureNote,
  UpdateCollectionCommand,
  VaultItemsCrudClient,
  VaultItemType,
} from "@dashlane/vault-contracts";
import {
  CommandHandler,
  CommandHandlerResponseOf,
  ICommandHandler,
} from "@dashlane/framework-application";
import { CollectionAction } from "@dashlane/hermes";
import { isFailure, success } from "@dashlane/framework-types";
import { CarbonLegacyClient } from "@dashlane/communication";
import {
  ActivityLogsClient,
  ActivityLogType,
  PropertiesForCollectionLogs,
} from "@dashlane/risk-monitoring-contracts";
import { ParsedURL } from "@dashlane/url-parser";
import { fetchCollections } from "../../data-fetching-helper";
import { sendUserUpdateCollectionEvent } from "../../log-helper";
import { createActivityLog } from "../../utils/activity-logs";
@CommandHandler(UpdateCollectionCommand)
export class UpdateCollectionCommandHandler
  implements ICommandHandler<UpdateCollectionCommand>
{
  constructor(
    private carbonLegacyClient: CarbonLegacyClient,
    private activityLogs: ActivityLogsClient,
    private vaultItemsCrudClient: VaultItemsCrudClient
  ) {}
  async execute({
    body,
  }: UpdateCollectionCommand): CommandHandlerResponseOf<UpdateCollectionCommand> {
    const {
      id,
      collection,
      operationType = OperationType.APPEND_VAULT_ITEMS,
    } = body;
    const collectionsFromCarbon = await firstValueFrom(
      fetchCollections(this.carbonLegacyClient, [id])
    );
    if (isFailure(collectionsFromCarbon)) {
      throw new Error(
        `Failed to fetch additional collection info: ${collectionsFromCarbon.error}`
      );
    }
    const existingCollection = collectionsFromCarbon.data.collections[0];
    let updatedCollection: Partial<Collection>;
    if (collection.vaultItems) {
      const newVaultItemsResult = await firstValueFrom(
        this.vaultItemsCrudClient.queries.query({
          vaultItemTypes: [VaultItemType.Credential, VaultItemType.SecureNote],
          ids: collection.vaultItems.map((item) => item.id),
        })
      );
      if (isFailure(newVaultItemsResult)) {
        throw new Error("Unable to find items in collection");
      }
      const newVaultCredentials: Credential[] =
        newVaultItemsResult.data.credentialsResult.items;
      const newVaultNotes: SecureNote[] =
        newVaultItemsResult.data.secureNotesResult.items;
      const newCollectionVaultItemCredentials = newVaultCredentials.map(
        (item) => ({
          id: item.id,
          type: VaultItemType.Credential,
          url: item.URL,
        })
      );
      const newCollectionVaultItemNotes = newVaultNotes.map((item) => ({
        id: item.id,
        type: VaultItemType.SecureNote,
      }));
      const newCollectionVaultItems = [
        ...newCollectionVaultItemCredentials,
        ...newCollectionVaultItemNotes,
      ];
      updatedCollection = {
        id: collection.id,
        name: collection.name,
        spaceId: collection.spaceId,
        vaultItems: newCollectionVaultItems,
      };
      existingCollection.vaultItems = this.mutateCollectionVaultItems(
        existingCollection,
        operationType,
        newCollectionVaultItems
      );
    } else {
      updatedCollection = {
        id: collection.id,
        name: collection.name,
        spaceId: collection.spaceId,
      };
    }
    const updateCollectionResult =
      await this.carbonLegacyClient.commands.carbon({
        name: "updateCollection",
        args: [
          {
            id: existingCollection.id,
            name: collection.name ?? existingCollection.name,
            spaceId: collection.spaceId ?? existingCollection.spaceId,
            vaultItems: existingCollection.vaultItems,
          },
        ],
      });
    if (isFailure(updateCollectionResult)) {
      throw new Error(
        `Failed to update collection: ${updateCollectionResult.error}`
      );
    }
    this.handleLogs(existingCollection, updatedCollection, operationType);
    return Promise.resolve(success(undefined));
  }
  private handleLogs(
    existingCollection: Collection,
    updateCollection: Partial<Collection>,
    operationType: OperationType
  ) {
    let logType:
      | ActivityLogType.UserAddedCredentialToCollection
      | ActivityLogType.UserRemovedCredentialFromCollection
      | ActivityLogType.UserRenamedCollection
      | null = null;
    const logPayload: PropertiesForCollectionLogs = {};
    if (updateCollection.name) {
      sendUserUpdateCollectionEvent(
        this.carbonLegacyClient,
        CollectionAction.Edit,
        existingCollection.id,
        existingCollection.vaultItems.length
      );
      if (updateCollection.name !== existingCollection.name) {
        logType = ActivityLogType.UserRenamedCollection;
        logPayload.collection_name = updateCollection.name;
        logPayload.old_collection_name = existingCollection.name;
      }
    }
    if (updateCollection.vaultItems) {
      sendUserUpdateCollectionEvent(
        this.carbonLegacyClient,
        operationType === OperationType.SUBSTRACT_VAULT_ITEMS
          ? CollectionAction.DeleteCredential
          : CollectionAction.AddCredential,
        existingCollection.id,
        1
      );
      if (updateCollection.vaultItems[0]?.type === VaultItemType.Credential) {
        logType =
          operationType === OperationType.APPEND_VAULT_ITEMS
            ? ActivityLogType.UserAddedCredentialToCollection
            : ActivityLogType.UserRemovedCredentialFromCollection;
        logPayload.collection_name = existingCollection.name;
        logPayload.domain_url = new ParsedURL(
          updateCollection.vaultItems[0].url
        ).getRootDomain();
      }
    }
    if (existingCollection.spaceId && logType) {
      const activityLog = createActivityLog(logType, logPayload);
      this.activityLogs.commands.storeActivityLogs({
        activityLogs: [activityLog],
      });
    }
  }
  private getDeduplicatedList(list: CollectionVaultItem[]) {
    return [...new Map(list.map((item) => [item.id, item])).values()];
  }
  private mutateCollectionVaultItems(
    collection: Collection,
    operationType: OperationType,
    vaultItems: CollectionVaultItem[]
  ): CollectionVaultItem[] {
    return operationType === OperationType.SUBSTRACT_VAULT_ITEMS
      ? collection.vaultItems.filter(
          (collectionVaultItem: CollectionVaultItem) =>
            !vaultItems.some(
              (vaultItem) => vaultItem.id === collectionVaultItem.id
            )
        )
      : this.getDeduplicatedList([...collection.vaultItems, ...vaultItems]);
  }
}
