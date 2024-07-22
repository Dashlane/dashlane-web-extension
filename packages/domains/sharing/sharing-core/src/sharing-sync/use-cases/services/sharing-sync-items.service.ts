import { uniqBy } from "ramda";
import { Injectable } from "@dashlane/framework-application";
import {
  PendingSharedItemInvite,
  Permission,
  RevisionSummary,
  ShareableItemType,
  SharedItem,
  Status,
  TimestampSummary,
} from "@dashlane/sharing-contracts";
import { ItemContent, ItemGroupDownload } from "@dashlane/server-sdk/v1";
import {
  Credential,
  isCredential,
  isNote,
  Note,
  Secret,
} from "@dashlane/communication";
import { safeCast } from "@dashlane/framework-types";
import { SharingCryptographyService, SharingDecryptionService } from "../../..";
import { determineUpdatesFromSummary } from "./determine-updates-from-summary";
import { CurrentUserWithKeyPair } from "../../../sharing-carbon-helpers";
import {
  SharedItemsRepository,
  SharedItemWithRevision,
} from "../../../sharing-items/handlers/common/shared-items-repository";
import { SharingSyncVaultUpdatesService } from "./sharing-sync-vault-updates.service";
import { toSharedItem } from "./item-group-download-mapper";
import { SharingUserGroupsRepository } from "../../../sharing-recipients/services/user-groups.repository";
import { SharedCollectionsNewRepository } from "../../../sharing-collections/handlers/common/shared-collections-new.repository";
import { PendingInvitesService } from "../../../sharing-invites/services/pending-invites.service";
interface PendingInviteWithoutContent {
  referrer: string;
  permission: Permission;
  sharedItemId: string;
  vaultItemId: string;
}
export const convertSharedItemToInvite = (
  sharedItem: SharedItem,
  item: Credential | Note | Secret,
  pendingAccess: PendingInviteWithoutContent
): PendingSharedItemInvite => {
  const base = {
    vaultItemId: sharedItem.itemId,
    title: item.Title,
    spaceId: item.SpaceId,
    referrer: pendingAccess.referrer,
    sharedItemId: sharedItem.sharedItemId,
    permission: pendingAccess.permission,
  };
  if (isCredential(item)) {
    return {
      ...base,
      itemType: ShareableItemType.Credential,
      url: item.Url,
      linkedDomains: item.LinkedServices?.associated_domains.map(
        (domains) => domains.domain
      ),
      email: item.Email,
      login: item.Login,
      secondaryLogin: item.SecondaryLogin,
    };
  } else if (isNote(item)) {
    return {
      ...base,
      itemType: ShareableItemType.SecureNote,
      color: item.Type,
      secured: item.Secured,
    };
  } else {
    return {
      ...base,
      itemType: ShareableItemType.Secret,
      secured: item.Secured,
    };
  }
};
@Injectable()
export class SharingSyncItemsService {
  public constructor(
    private sharedItemsRepo: SharedItemsRepository,
    private userGroupsRepo: SharingUserGroupsRepository,
    private collectionsRepo: SharedCollectionsNewRepository,
    private vaultUpdatesService: SharingSyncVaultUpdatesService,
    private sharingCrypto: SharingCryptographyService,
    private sharingDecryption: SharingDecryptionService,
    private pendingInvitesService: PendingInvitesService
  ) {}
  public async getItemsChangesFromSummary(itemsSummary: TimestampSummary[]) {
    const currentItems = await this.sharedItemsRepo.getVaultItemsIndex();
    const {
      newIds: newItemsIds,
      updatedIds: updatedItemsIds,
      unchanged: unchangedItems,
    } = determineUpdatesFromSummary(
      itemsSummary.map(({ id, timestamp }) => ({ id, revision: timestamp })),
      currentItems
    );
    return { newItemsIds, updatedItemsIds, unchangedItems };
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
    return { newItemGroupIds, updatedItemGroupIds, unchangedItemGroups };
  }
  public async syncSharedItems(
    updatedItemGroups: ItemGroupDownload[],
    unchangedItemGroups: SharedItem[],
    updatedItems: ItemContent[],
    unchangedItems: RevisionSummary[],
    currentUser: CurrentUserWithKeyPair
  ) {
    const myUserGroups = Object.values(
      await this.userGroupsRepo.getUserGroups()
    );
    const myCollections = Object.values(
      await this.collectionsRepo.getCollections()
    );
    const { validatedSharedItems, pendingInvitesWithoutContent } =
      await updatedItemGroups.reduce(
        async (result, itemGroup) => {
          const sharedItem = toSharedItem(
            itemGroup,
            myUserGroups,
            myCollections,
            currentUser.login
          );
          const pendingDirectAccess = itemGroup.users?.find(
            (user) =>
              user.userId === currentUser.login &&
              user.status === Status.Pending
          );
          const isValid =
            pendingDirectAccess ||
            (await this.isSharedItemValid(sharedItem, currentUser));
          const currentResult = await result;
          if (isValid) {
            currentResult.validatedSharedItems.push(sharedItem);
          }
          if (pendingDirectAccess) {
            const { referrer, permission } = pendingDirectAccess;
            const { sharedItemId, itemId } = sharedItem;
            currentResult.pendingInvitesWithoutContent[sharedItemId] = {
              referrer,
              permission,
              sharedItemId,
              vaultItemId: itemId,
            };
          }
          return result;
        },
        Promise.resolve({
          validatedSharedItems: safeCast<SharedItem[]>([]),
          pendingInvitesWithoutContent: safeCast<
            Record<string, PendingInviteWithoutContent>
          >({}),
        })
      );
    const hasItemGroupsChanged = validatedSharedItems.length > 0;
    const newSharedItemsList = unchangedItemGroups.concat(validatedSharedItems);
    const acceptedSharedItemsIndex = newSharedItemsList.reduce((acc, entry) => {
      if (entry.accessLink?.acceptSignature) {
        acc[entry.itemId] = entry;
      }
      return acc;
    }, safeCast<Record<string, SharedItem>>({}));
    let newItemsList = unchangedItems;
    if (updatedItems.length) {
      const validatedItems = await this.vaultUpdatesService.runVaultUpdates(
        updatedItems,
        acceptedSharedItemsIndex
      );
      if (validatedItems?.length) {
        newItemsList = newItemsList.concat(validatedItems);
      }
    }
    if (hasItemGroupsChanged) {
      const newItemsIndex = newItemsList.reduce((acc, entry) => {
        acc[entry.id] = entry;
        return acc;
      }, safeCast<Record<string, RevisionSummary>>({}));
      const newSharedItems = newSharedItemsList.reduce((result, sharedItem) => {
        const item = newItemsIndex[sharedItem.itemId];
        if (item) {
          const { revision } = item;
          result.push({ sharedItem, revision });
        }
        return result;
      }, safeCast<SharedItemWithRevision[]>([]));
      this.sharedItemsRepo.setSharedItems(newSharedItems);
    }
    this.resolvePendingInvites(
      updatedItems,
      newSharedItemsList,
      pendingInvitesWithoutContent
    );
  }
  public async deleteItems(itemsSummary: TimestampSummary[]) {
    const currentItems = await this.sharedItemsRepo.getSharedItemsIndex();
    if (currentItems?.length) {
      const deletedItemsIds = Object.keys(currentItems).filter(
        (itemId) =>
          !itemsSummary.find((itemSummary) => itemSummary.id === itemId)
      );
      if (deletedItemsIds.length) {
        this.vaultUpdatesService.deleteVaultItems(deletedItemsIds);
      }
    }
  }
  private async resolvePendingInvites(
    updatedItems: ItemContent[],
    newSharedItemsList: SharedItem[],
    pendingInvitesWithoutContent: Record<string, PendingInviteWithoutContent>
  ) {
    const updatedItemsIndex = updatedItems.reduce((acc, entry) => {
      acc[entry.itemId] = entry;
      return acc;
    }, safeCast<Record<string, ItemContent>>({}));
    const pendingInvites = await newSharedItemsList.reduce(
      async (result, sharedItem) => {
        const pendingAccess =
          pendingInvitesWithoutContent[sharedItem.sharedItemId];
        if (pendingAccess) {
          const itemContent = updatedItemsIndex[sharedItem.itemId];
          if (itemContent) {
            const vaultItem = await this.vaultUpdatesService.decryptItemContent(
              sharedItem,
              itemContent.content
            );
            if (vaultItem) {
              (await result).push(
                convertSharedItemToInvite(sharedItem, vaultItem, pendingAccess)
              );
            }
          }
        }
        return result;
      },
      Promise.resolve(safeCast<PendingSharedItemInvite[]>([]))
    );
    const currentPendingInvites =
      await this.pendingInvitesService.getSharedItemsInvites();
    const newPendingInvitesList = uniqBy(
      (invite) => invite.sharedItemId,
      pendingInvites.concat(currentPendingInvites)
    );
    this.pendingInvitesService.setSharedItemInvites(newPendingInvitesList);
  }
  private async isSharedItemValid(
    sharedItem: SharedItem,
    currentUser: CurrentUserWithKeyPair
  ) {
    const { publicKey } = currentUser;
    if (!sharedItem.accessLink?.acceptSignature) {
      return false;
    }
    const { acceptSignature } = sharedItem.accessLink;
    const itemGroupKey = await this.sharingDecryption.decryptItemGroupKey(
      sharedItem
    );
    if (!itemGroupKey) {
      return false;
    }
    return this.sharingCrypto.verifyAcceptSignature(
      publicKey,
      acceptSignature,
      sharedItem.sharedItemId,
      itemGroupKey
    );
  }
}
