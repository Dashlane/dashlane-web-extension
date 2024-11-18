import { firstValueFrom, map } from "rxjs";
import { Injectable } from "@dashlane/framework-application";
import { isFailure, mapSuccessObservable } from "@dashlane/framework-types";
import { InviteGetterService } from "../../../sharing-carbon-helpers/services/invites-getter.service";
import { PendingSharedItemInvitesStore } from "../../store/pending-shared-item-invites.store";
import { PendingSharedItemInvite } from "@dashlane/sharing-contracts";
@Injectable()
export class SharedItemContentGetterService {
  public constructor(
    private readonly inviteGetter: InviteGetterService,
    private readonly store: PendingSharedItemInvitesStore
  ) {}
  public async getSharedItemContentLegacy(itemGroupId: string) {
    const itemContent$ = this.inviteGetter.get().pipe(
      mapSuccessObservable((result) => {
        const pendingItemGroup = result.pendingItemGroups.find(
          (itemGroup) => itemGroup.itemGroupId === itemGroupId
        );
        if (!pendingItemGroup) {
          throw new Error(
            "Pending item group not found when accepting/refusing invite"
          );
        }
        if (pendingItemGroup.items.length < 1) {
          throw new Error(
            "Missing item content for pending item group when accepting/refusing invite"
          );
        }
        return pendingItemGroup.items[0];
      })
    );
    const itemContentData = await firstValueFrom(itemContent$);
    if (isFailure(itemContentData)) {
      throw new Error(
        "Failed to retrieve item content for pending item group when accepting/refusing invite"
      );
    }
    return itemContentData.data;
  }
  public async getSharedItemContent(
    sharedItemId: string
  ): Promise<PendingSharedItemInvite> {
    const itemContent$ = this.store.state$.pipe(
      map((pendingInvites) => {
        const pendingInvite = pendingInvites.find(
          (invite) => invite.sharedItemId === sharedItemId
        );
        if (!pendingInvite) {
          throw new Error(
            "Pending item group not found when accepting/refusing invite"
          );
        }
        return pendingInvite;
      })
    );
    return firstValueFrom(itemContent$);
  }
}
