import { firstValueFrom, map, Observable } from "rxjs";
import { safeCast } from "@dashlane/framework-types";
import { Injectable } from "@dashlane/framework-application";
import { Credential, Note, Secret } from "@dashlane/communication";
import {
  Permission,
  SharedItem,
  ShareItemRequestPayload,
} from "@dashlane/sharing-contracts";
import { SharedItemsRepository } from "../common/shared-items-repository";
import { SharingItemGroupsService } from "../../../sharing-common";
import { ShareItemErrorDetails } from "../../store/share-items-errors.store";
import { SharingItemsInvitesService } from "../commands/common/sharing-items-invites.service";
import { mapToShareItemLimitedAccessError } from "../commands/common/share-items-mappers";
import { ShareableItemsService } from "./shareable-items.service";
@Injectable()
export class ShareItemsService {
  constructor(
    private readonly sharingItemsInvitesService: SharingItemsInvitesService,
    private readonly sharingItemsService: SharingItemGroupsService,
    private readonly sharedItemsRepository: SharedItemsRepository,
    private readonly shareableItems: ShareableItemsService
  ) {}
  public async run(params: ShareItemRequestPayload) {
    const { vaultItemIds, permission, userLogins, userGroupIds } = params;
    const { credentials, secrets, notes, notesErrors } =
      await this.shareableItems.get(vaultItemIds);
    const allVaultItems = [...notes, ...credentials, ...secrets];
    const {
      alreadySharedItems,
      alreadySharedItemsErrors,
      alreadySharedItemIds,
    } = await firstValueFrom(
      this.getAlreadySharedItems(allVaultItems, vaultItemIds)
    );
    const itemsNotSharedYet = allVaultItems.filter(
      (item) => !alreadySharedItemIds.includes(item.Id)
    );
    const newlySharedItems = itemsNotSharedYet.length
      ? await this.sharingItemsService.createMultipleItemGroups(
          itemsNotSharedYet
        )
      : [];
    const allSharedItems = [...alreadySharedItems, ...newlySharedItems];
    const inviteErrors = allSharedItems.length
      ? await this.sharingItemsInvitesService.inviteRecipients(
          userLogins,
          userGroupIds,
          allSharedItems,
          allVaultItems,
          permission
        )
      : [];
    const errors = [
      ...notesErrors,
      ...alreadySharedItemsErrors,
      ...inviteErrors,
    ];
    return { hasChanges: allSharedItems.length > 0, errors };
  }
  private getAlreadySharedItems(
    allVaultItems: Array<Credential | Note | Secret>,
    vaultItemIds: string[]
  ): Observable<{
    alreadySharedItems: SharedItem[];
    alreadySharedItemsErrors: ShareItemErrorDetails[];
    alreadySharedItemIds: string[];
  }> {
    return this.sharedItemsRepository.sharedItemsForIds$(vaultItemIds).pipe(
      map((sharedItems) =>
        sharedItems.reduce(
          (acc, sharedItem) => {
            if (sharedItem.permission === Permission.Limited) {
              acc.alreadySharedItemsErrors.push(
                mapToShareItemLimitedAccessError(
                  sharedItem.itemId,
                  allVaultItems
                )
              );
            } else {
              acc.alreadySharedItems.push(sharedItem);
            }
            acc.alreadySharedItemIds.push(sharedItem.itemId);
            return acc;
          },
          {
            alreadySharedItems: safeCast<SharedItem[]>([]),
            alreadySharedItemsErrors: safeCast<ShareItemErrorDetails[]>([]),
            alreadySharedItemIds: safeCast<string[]>([]),
          }
        )
      )
    );
  }
}
