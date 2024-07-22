import { firstValueFrom } from "rxjs";
import { Injectable } from "@dashlane/framework-application";
import { isFailure, mapSuccessObservable } from "@dashlane/framework-types";
import { InviteGetterService } from "../../../sharing-carbon-helpers/services/invites-getter.service";
@Injectable()
export class SharedItemContentGetterService {
  public constructor(private readonly inviteGetter: InviteGetterService) {}
  public async getSharedItemContent(itemGroupId: string) {
    const itemContent$ = this.inviteGetter.get().pipe(
      mapSuccessObservable((result) => {
        const pendingItemGroup = result.pendingItemGroups.find(
          (itemGroup) => itemGroup.itemGroupId === itemGroupId
        );
        if (!pendingItemGroup) {
          throw new Error("Pending item group not found when refusing invite");
        }
        if (pendingItemGroup.items.length < 1) {
          throw new Error(
            "Missing item content for pending item group when refusing invite"
          );
        }
        return pendingItemGroup.items[0];
      })
    );
    const itemContentData = await firstValueFrom(itemContent$);
    if (isFailure(itemContentData)) {
      throw new Error(
        "Failed to retrieve item content for pending item group when refusing invite"
      );
    }
    return itemContentData.data;
  }
}
