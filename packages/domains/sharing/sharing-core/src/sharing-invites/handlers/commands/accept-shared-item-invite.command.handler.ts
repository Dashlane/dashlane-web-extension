import { firstValueFrom } from "rxjs";
import {
  CommandHandler,
  type CommandHandlerResponseOf,
  type ICommandHandler,
} from "@dashlane/framework-application";
import { ServerApiClient } from "@dashlane/framework-dashlane-application";
import {
  getSuccess,
  isFailure,
  isSuccess,
  success,
} from "@dashlane/framework-types";
import { FeatureFlipsClient } from "@dashlane/framework-contracts";
import {
  AcceptSharedItemInviteCommand,
  SharingSyncFeatureFlips,
} from "@dashlane/sharing-contracts";
import {
  CurrentUserWithKeysGetterService,
  ItemGroupsGetterService,
} from "../../../sharing-carbon-helpers";
import {
  SharingCryptographyService,
  SharingDecryptionService,
} from "../../../sharing-crypto";
import { SharingSyncService } from "../../../sharing-common";
import {
  getEmailInfoForPendingInvite,
  getEmailInfoForSharedItem,
} from "../../utils";
import { SharedItemContentGetterService } from "../common/shared-item-content-getter.service";
import { SharedItemsRepository } from "../../../sharing-items/handlers/common/shared-items-repository";
@CommandHandler(AcceptSharedItemInviteCommand)
export class AcceptSharedItemInviteCommandHandler
  implements ICommandHandler<AcceptSharedItemInviteCommand>
{
  constructor(
    private readonly serverApiClient: ServerApiClient,
    private readonly itemGroupsGetter: ItemGroupsGetterService,
    private readonly sharedItemsRepository: SharedItemsRepository,
    private readonly sharingDecryption: SharingDecryptionService,
    private readonly currentUserGetter: CurrentUserWithKeysGetterService,
    private readonly sharingCrypto: SharingCryptographyService,
    private readonly sharingSync: SharingSyncService,
    private readonly sharedItemContent: SharedItemContentGetterService,
    private readonly featureFlips: FeatureFlipsClient
  ) {}
  async execute(command: AcceptSharedItemInviteCommand) {
    const { userFeatureFlip } = this.featureFlips.queries;
    const isNewSharingSyncEnabledResult = await firstValueFrom(
      userFeatureFlip({
        featureFlip: SharingSyncFeatureFlips.SharingSyncGrapheneMigrationDev,
      })
    );
    const isNewSharingSyncEnabled = isSuccess(isNewSharingSyncEnabledResult)
      ? !!getSuccess(isNewSharingSyncEnabledResult)
      : false;
    return isNewSharingSyncEnabled
      ? this.executeWithNewState(command)
      : this.executeWithCarbonState(command);
  }
  async executeWithCarbonState({ body }: AcceptSharedItemInviteCommand) {
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
    const itemContent = await this.sharedItemContent.getSharedItemContentLegacy(
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
  async executeWithNewState({
    body,
  }: AcceptSharedItemInviteCommand): CommandHandlerResponseOf<AcceptSharedItemInviteCommand> {
    const { itemGroupId } = body;
    const index = await this.sharedItemsRepository.getSharedItemsIndex();
    const sharedItem = index[itemGroupId];
    if (!sharedItem) {
      throw new Error("Item group not found");
    }
    const currentUser = await this.currentUserGetter.getCurrentUserWithKeys();
    const decryptedItemGroupKey =
      await this.sharingDecryption.decryptItemGroupKey(sharedItem);
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
        revision: sharedItem.revision,
        itemsForEmailing: [getEmailInfoForPendingInvite(itemContent)],
      })
    );
    await this.sharingSync.scheduleSync();
    return success(undefined);
  }
}
