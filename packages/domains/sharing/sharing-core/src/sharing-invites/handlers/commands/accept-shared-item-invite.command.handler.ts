import { firstValueFrom } from "rxjs";
import {
  CommandHandler,
  type CommandHandlerResponseOf,
  type ICommandHandler,
} from "@dashlane/framework-application";
import { ServerApiClient } from "@dashlane/framework-dashlane-application";
import { getSuccess, isFailure, success } from "@dashlane/framework-types";
import { AcceptSharedItemInviteCommand } from "@dashlane/sharing-contracts";
import {
  CurrentUserWithKeysGetterService,
  ItemGroupsGetterService,
} from "../../../sharing-carbon-helpers";
import {
  SharingCryptographyService,
  SharingDecryptionService,
} from "../../../sharing-crypto";
import { SharingSyncService } from "../../../sharing-common";
import { getEmailInfoForSharedItem } from "../../utils";
import { SharedItemContentGetterService } from "../common/shared-item-content-getter.service";
@CommandHandler(AcceptSharedItemInviteCommand)
export class AcceptSharedItemInviteCommandHandler
  implements ICommandHandler<AcceptSharedItemInviteCommand>
{
  constructor(
    private readonly serverApiClient: ServerApiClient,
    private readonly itemGroupsGetter: ItemGroupsGetterService,
    private readonly sharingDecryption: SharingDecryptionService,
    private readonly currentUserGetter: CurrentUserWithKeysGetterService,
    private readonly sharingCrypto: SharingCryptographyService,
    private readonly sharingSync: SharingSyncService,
    private readonly sharedItemContent: SharedItemContentGetterService
  ) {}
  async execute({
    body,
  }: AcceptSharedItemInviteCommand): CommandHandlerResponseOf<AcceptSharedItemInviteCommand> {
    const { itemGroupId } = body;
    const itemGroupResult = await firstValueFrom(
      this.itemGroupsGetter.getForItemGroupId(itemGroupId)
    );
    if (isFailure(itemGroupResult)) {
      throw new Error(
        "Error fetching item groups when trying to accept shared item"
      );
    }
    const itemGroup = getSuccess(itemGroupResult);
    if (!itemGroup) {
      throw new Error("Item group not found");
    }
    const currentUser = await this.currentUserGetter.getCurrentUserWithKeys();
    const userWithGroupKey = itemGroup.users?.find(
      (user) => user.userId === currentUser.login
    );
    if (!userWithGroupKey?.groupKey) {
      throw new Error("Item group key not found");
    }
    const decryptedItemGroupKey =
      await this.sharingDecryption.decryptResourceKeyViaUserMember(
        { encryptedResourceKey: userWithGroupKey.groupKey },
        currentUser
      );
    if (!decryptedItemGroupKey) {
      throw new Error("Failed to decrypt item group key");
    }
    const acceptSignature = await this.sharingCrypto.createAcceptSignature(
      currentUser.privateKey,
      itemGroupId,
      decryptedItemGroupKey
    );
    const itemContent = await this.sharedItemContent.getSharedItemContent(
      itemGroupId
    );
    await firstValueFrom(
      this.serverApiClient.v1.sharingUserdevice.acceptItemGroup({
        acceptSignature,
        groupId: itemGroupId,
        revision: itemGroup.revision,
        itemsForEmailing: [getEmailInfoForSharedItem(itemContent)],
      })
    );
    await this.sharingSync.scheduleSync();
    return success(undefined);
  }
}
