import { ItemContent } from "@dashlane/communication";
import {
  PendingSharedItemInvite,
  SharedItem,
} from "@dashlane/sharing-contracts";
import {
  convertSharedItemToInvite,
  PendingInviteWithoutContent,
} from "./sharing-sync-items-helpers";
import { createIndex } from "../../../utils/create-index";
import { safeCast } from "@dashlane/framework-types";
import { PendingInvitesService } from "../../../sharing-invites/services/pending-invites.service";
import { SharingSyncVaultUpdatesService } from "./sharing-sync-vault-updates.service";
import { Injectable } from "@dashlane/framework-application";
@Injectable()
export class SharingSyncPendingSharedItemsService {
  public constructor(
    private readonly vaultUpdatesService: SharingSyncVaultUpdatesService,
    private readonly pendingInvitesService: PendingInvitesService
  ) {}
  public async resolvePendingInvites(
    updatedItems: ItemContent[],
    unchangedSharedItems: SharedItem[],
    newSharedItemsList: SharedItem[],
    pendingInvitesWithoutContent: Record<string, PendingInviteWithoutContent>
  ) {
    const updatedItemsIndex = createIndex(
      updatedItems,
      (entry) => entry.itemId
    );
    const existingPendingInvites = (
      await this.pendingInvitesService.getSharedItemsInvites()
    ).filter((invite) =>
      unchangedSharedItems.some(
        (unchangedSharedItem) =>
          unchangedSharedItem.sharedItemId === invite.sharedItemId &&
          !unchangedSharedItem.accessLink?.acceptSignature
      )
    );
    const existingPendingInvitesIndex = createIndex(
      existingPendingInvites,
      (entry) => entry.sharedItemId
    );
    const pendingInvites = await newSharedItemsList.reduce(
      async (result, sharedItem) => {
        const invite = await this.resolvePendingInvite(
          sharedItem,
          updatedItemsIndex,
          pendingInvitesWithoutContent,
          existingPendingInvitesIndex
        );
        if (invite) {
          (await result).push(invite);
        }
        return result;
      },
      Promise.resolve(safeCast<PendingSharedItemInvite[]>([]))
    );
    this.pendingInvitesService.setSharedItemInvites(pendingInvites);
    return pendingInvites;
  }
  private async resolvePendingInvite(
    sharedItem: SharedItem,
    updatedItemsIndex: Record<string, ItemContent>,
    pendingInvitesWithoutContent: Record<string, PendingInviteWithoutContent>,
    existingPendingInvitesIndex: Record<string, PendingSharedItemInvite>
  ) {
    const pendingInviteWithoutContent =
      pendingInvitesWithoutContent[sharedItem.sharedItemId];
    const existingPendingInvite =
      existingPendingInvitesIndex[sharedItem.sharedItemId];
    if (pendingInviteWithoutContent || existingPendingInvite) {
      const pendingAccess = pendingInviteWithoutContent ?? {
        permission: existingPendingInvite.permission,
        referrer: existingPendingInvite.referrer,
        sharedItemId: sharedItem.sharedItemId,
        vaultItemId: sharedItem.itemId,
      };
      const inviteWithUpdatedContent =
        await this.decryptItemContentAndConvertToInvite(
          updatedItemsIndex,
          sharedItem,
          pendingAccess
        );
      if (inviteWithUpdatedContent) {
        return inviteWithUpdatedContent;
      }
    }
    if (existingPendingInvite) {
      return existingPendingInvite;
    }
  }
  private async decryptItemContentAndConvertToInvite(
    updatedItemsIndex: Record<string, ItemContent>,
    sharedItem: SharedItem,
    pendingAccess: PendingInviteWithoutContent
  ) {
    const itemContent = updatedItemsIndex[sharedItem.itemId];
    if (itemContent) {
      const vaultItem = await this.vaultUpdatesService.decryptItemContent(
        sharedItem,
        itemContent.content
      );
      if (vaultItem) {
        return convertSharedItemToInvite(
          sharedItem,
          vaultItem,
          pendingAccess,
          itemContent.timestamp
        );
      }
    }
  }
}
