import { Injectable } from "@dashlane/framework-application";
import {
  AnomalyCriticalityValues,
  ExceptionLoggingClient,
} from "@dashlane/framework-contracts";
import { safeCast } from "@dashlane/framework-types";
import {
  RevisionSummary,
  SharedAccess,
  SharedItem,
  SharingUserGroup,
  Status,
  TimestampSummary,
} from "@dashlane/sharing-contracts";
import { ItemContent, ItemGroupDownload } from "@dashlane/server-sdk/v1";
import { CurrentUserWithKeyPair } from "../../../sharing-carbon-helpers";
import {
  SharedItemsRepository,
  SharedItemWithRevision,
} from "../../../sharing-items/handlers/common/shared-items-repository";
import { SharingSyncVaultUpdatesService } from "./sharing-sync-vault-updates.service";
import { toSharedItem } from "../../../utils/mappers/item-group-download-mapper";
import { SharingUserGroupsRepository } from "../../../sharing-recipients/services/user-groups.repository";
import { SharedCollectionsNewRepository } from "../../../sharing-collections/handlers/common/shared-collections-new.repository";
import { toSharedAccess } from "../../../sharing-items/data-adapters/item-group-adapter";
import {
  isLastActiveUserInItemGroupAndAdmin,
  PendingInviteWithoutContent,
} from "./sharing-sync-items-helpers";
import { createIndex } from "../../../utils/create-index";
import { SharingSyncResendInvitesService } from "./sharing-sync-resend-invites.service";
import { SharingSyncPendingSharedItemsService } from "./sharing-sync-pending-shared-items.service";
import { SharedCollectionState } from "../../../sharing-collections/data-access/shared-collections.state";
import { SharedVaultItemEntry } from "../../../sharing-items/store/shared-items.store";
import { determineUpdatesFromSummary } from "./determine-updates-from-summary";
import { SharingSyncLastAdminService } from "./sharing-sync-last-admin.service";
import { SharingSyncValidationService } from "./sharing-sync-validation.service";
@Injectable()
export class SharingSyncItemsService {
  public constructor(
    private readonly sharedItemsRepo: SharedItemsRepository,
    private readonly userGroupsRepo: SharingUserGroupsRepository,
    private readonly collectionsRepo: SharedCollectionsNewRepository,
    private readonly vaultUpdatesService: SharingSyncVaultUpdatesService,
    private readonly validationService: SharingSyncValidationService,
    private readonly pendingInvitesService: SharingSyncPendingSharedItemsService,
    private readonly sharingSyncResendInvites: SharingSyncResendInvitesService,
    private readonly sharingSyncLastAdmin: SharingSyncLastAdminService,
    private readonly exceptionLoggingClient: ExceptionLoggingClient
  ) {}
  public async getItemsChangesFromSummary(
    itemsSummary: TimestampSummary[],
    updatedItemGroupIds: string[]
  ) {
    const currentItems = await this.sharedItemsRepo.getVaultItemsIndex();
    const { newItemsIds, updatedItemsIds, unchangedItems } =
      itemsSummary.reduce(
        (updates, summary) => {
          const currentObject = currentItems[summary.id];
          if (currentObject) {
            if (
              currentObject.revision < summary.timestamp ||
              (!currentObject.savedToVault &&
                updatedItemGroupIds.includes(currentObject.sharedItemId))
            ) {
              updates.updatedItemsIds.push(summary.id);
            } else {
              updates.unchangedItems.push(currentObject);
            }
          } else {
            updates.newItemsIds.push(summary.id);
          }
          return updates;
        },
        {
          newItemsIds: safeCast<string[]>([]),
          updatedItemsIds: safeCast<string[]>([]),
          unchangedItems: safeCast<SharedVaultItemEntry[]>([]),
        }
      );
    const revokedIds = Object.values(currentItems)
      .filter(
        (sharedItem) =>
          !itemsSummary.find(
            (itemSummary) => itemSummary.id === sharedItem.vaultItemId
          )
      )
      .map((item) => item.vaultItemId);
    return {
      newItemsIds,
      updatedItemsIds,
      unchangedItems,
      revokedIds,
      isItemsSyncNeeded: updatedItemsIds.length || revokedIds.length,
    };
  }
  public async getSharedItemsChangesFromSummary(
    sharedItemsSummary: RevisionSummary[]
  ) {
    const currentSharedItems = await this.sharedItemsRepo.getSharedItemsIndex();
    const {
      newIds: newItemGroupIds,
      updatedIds: updatedItemGroupIds,
      unchanged: unchangedItemGroups,
    } = determineUpdatesFromSummary(sharedItemsSummary, currentSharedItems);
    return {
      newItemGroupIds,
      updatedItemGroupIds,
      unchangedItemGroups,
      isSharedItemsSyncNeeded:
        updatedItemGroupIds.length ||
        Object.keys(currentSharedItems).length !== sharedItemsSummary.length,
    };
  }
  public async syncSharedItems(
    updatedItemGroups: ItemGroupDownload[],
    unchangedItemGroups: SharedItem[],
    updatedItems: ItemContent[],
    unchangedItems: SharedVaultItemEntry[],
    currentUser: CurrentUserWithKeyPair
  ) {
    const myUserGroups = Object.values(
      await this.userGroupsRepo.getUserGroups()
    );
    const myCollections = Object.values(
      await this.collectionsRepo.getCollections()
    );
    const {
      validatedSharedItems,
      pendingInvitesWithoutContent,
      validatedSharedAccess,
      sharedItemsToDelete,
    } = await updatedItemGroups.reduce(
      async (result, itemGroup) => {
        if (itemGroup.type !== "items") {
          return result;
        }
        const sharedItemId = itemGroup.groupId;
        const currentResult = await result;
        const syncResult = await this.syncSharedItem(
          itemGroup,
          myUserGroups,
          myCollections,
          currentUser
        );
        if (syncResult) {
          const { sharedItem, sharedAccess, pendingInvite } = syncResult;
          if (
            isLastActiveUserInItemGroupAndAdmin(itemGroup, currentUser.login)
          ) {
            try {
              await this.sharingSyncLastAdmin.deleteLastAdminSharedItem(
                sharedItem
              );
              currentResult.sharedItemsToDelete.push(sharedItem.sharedItemId);
            } catch (err) {
              this.exceptionLoggingClient.commands.reportAnomaly({
                criticality: AnomalyCriticalityValues.CRITICAL,
                message: "Error when trying to unshare an item",
                moduleName: "SharingSyncModule",
                useCaseName: "sharing-sync-items.service",
                applicationComponent: "Sharing",
                anomalyType: "exception",
                origin: "uncaughtException",
              });
            }
          } else {
            currentResult.validatedSharedItems.push(sharedItem);
            currentResult.validatedSharedAccess[itemGroup.groupId] =
              sharedAccess;
            if (pendingInvite) {
              currentResult.pendingInvitesWithoutContent[sharedItemId] =
                pendingInvite;
            }
          }
        }
        return result;
      },
      Promise.resolve({
        validatedSharedItems: safeCast<SharedItem[]>([]),
        pendingInvitesWithoutContent: safeCast<
          Record<string, PendingInviteWithoutContent>
        >({}),
        validatedSharedAccess: safeCast<Record<string, SharedAccess>>({}),
        sharedItemsToDelete: safeCast<string[]>([]),
      })
    );
    const newSharedItemsList = unchangedItemGroups.concat(validatedSharedItems);
    const acceptedSharedItemsIndex = createIndex(
      newSharedItemsList.filter(
        (sharedItem) => sharedItem.accessLink?.acceptSignature
      ),
      (entry) => entry.itemId
    );
    let newItemsList = unchangedItems;
    let validatedItems = null;
    if (updatedItems.length) {
      validatedItems = await this.vaultUpdatesService.runVaultUpdates(
        updatedItems,
        acceptedSharedItemsIndex
      );
      if (validatedItems?.length) {
        newItemsList = newItemsList.concat(validatedItems);
      }
    }
    const pendingInvites =
      await this.pendingInvitesService.resolvePendingInvites(
        updatedItems,
        unchangedItemGroups,
        newSharedItemsList,
        pendingInvitesWithoutContent
      );
    const newItemsIndex = createIndex(
      newItemsList,
      (entry) => entry.vaultItemId
    );
    const pendingInvitesIndex = createIndex(
      pendingInvites,
      (entry) => entry.sharedItemId
    );
    const newSharedItems = newSharedItemsList.reduce((result, sharedItem) => {
      if (sharedItemsToDelete.includes(sharedItem.sharedItemId)) {
        return result;
      }
      const item = newItemsIndex[sharedItem.itemId];
      if (item) {
        const { revision, savedToVault } = item;
        result.push({ sharedItem, revision, savedToVault });
      } else {
        const pendingInvite = pendingInvitesIndex[sharedItem.sharedItemId];
        if (pendingInvite) {
          const { revision } = pendingInvite;
          result.push({ sharedItem, revision, savedToVault: false });
        }
      }
      return result;
    }, safeCast<SharedItemWithRevision[]>([]));
    this.sharedItemsRepo.setSharedItems(newSharedItems, validatedSharedAccess);
  }
  public async deleteItems(revokedIds: string[]) {
    const currentItems = await this.sharedItemsRepo.getSharedItemsIndex();
    const notAcceptedAnymore = Object.values(currentItems).filter(
      (sharedItem) => {
        return !sharedItem.accessLink?.acceptSignature;
      }
    );
    const deletedItemsIds = notAcceptedAnymore
      .map((sharedItem) => sharedItem.itemId)
      .concat(revokedIds);
    if (deletedItemsIds.length) {
      this.vaultUpdatesService.deleteVaultItems(deletedItemsIds);
    }
  }
  private async syncSharedItem(
    itemGroup: ItemGroupDownload,
    myUserGroups: SharingUserGroup[],
    myCollections: SharedCollectionState[],
    currentUser: CurrentUserWithKeyPair
  ) {
    const sharedItem = toSharedItem(
      itemGroup,
      myUserGroups,
      myCollections,
      currentUser.login
    );
    const isSharedItemValid = await this.validationService.isSharedItemValid(
      sharedItem,
      currentUser
    );
    if (isSharedItemValid.isValid) {
      this.sharingSyncResendInvites.checkPublicKeysAndResendInvites(
        itemGroup,
        sharedItem,
        isSharedItemValid.itemGroupKey
      );
    }
    const pendingDirectAccess = itemGroup.users?.find(
      (user) =>
        user.userId === currentUser.login && user.status === Status.Pending
    );
    if (!isSharedItemValid.isValid && !pendingDirectAccess) {
      return;
    }
    if (pendingDirectAccess) {
      const { referrer, permission } = pendingDirectAccess;
      const { sharedItemId, itemId } = sharedItem;
      return {
        sharedItem,
        sharedAccess: toSharedAccess(itemGroup),
        pendingInvite: {
          referrer,
          permission,
          sharedItemId,
          vaultItemId: itemId,
        },
      };
    }
    return {
      sharedItem,
      sharedAccess: toSharedAccess(itemGroup),
    };
  }
}
