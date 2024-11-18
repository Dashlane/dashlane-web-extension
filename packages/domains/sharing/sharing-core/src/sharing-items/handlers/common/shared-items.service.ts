import { firstValueFrom } from "rxjs";
import { Injectable } from "@dashlane/framework-application";
import { ServerApiClient } from "@dashlane/framework-dashlane-application";
import { SharedItemsRepository } from "./shared-items-repository";
@Injectable()
export class SharedItemsService {
  constructor(
    private readonly serverApiClient: ServerApiClient,
    private readonly sharedItemRepository: SharedItemsRepository
  ) {}
  public async refuseSharedItem(vaultItemId: string) {
    const sharedItem = await firstValueFrom(
      this.sharedItemRepository.sharedItemForId$(vaultItemId)
    );
    if (!sharedItem) {
      throw new Error("Failed to retrieve shared item to refuse");
    }
    await firstValueFrom(
      this.serverApiClient.v1.sharingUserdevice.refuseItemGroup({
        groupId: sharedItem.sharedItemId,
        revision: sharedItem.revision,
      })
    );
  }
}
