import { firstValueFrom } from "rxjs";
import {
  CommandHandler,
  type CommandHandlerResponseOf,
  type ICommandHandler,
} from "@dashlane/framework-application";
import { ServerApiClient } from "@dashlane/framework-dashlane-application";
import { success } from "@dashlane/framework-types";
import { AcceptUserGroupInviteCommand } from "@dashlane/sharing-contracts";
import { ProvisioningMethod } from "@dashlane/server-sdk/v1";
import { CurrentUserWithKeysGetterService } from "../../../sharing-carbon-helpers";
import { SharingSyncService } from "../../../sharing-common";
import {
  SharingCryptographyService,
  SharingDecryptionService,
} from "../../../sharing-crypto";
import { SharingUserGroupsRepository } from "../../../sharing-recipients/services/user-groups.repository";
@CommandHandler(AcceptUserGroupInviteCommand)
export class AcceptUserGroupInviteCommandHandler
  implements ICommandHandler<AcceptUserGroupInviteCommand>
{
  constructor(
    private readonly serverApiClient: ServerApiClient,
    private readonly sharingDecryption: SharingDecryptionService,
    private readonly currentUserGetter: CurrentUserWithKeysGetterService,
    private readonly sharingCrypto: SharingCryptographyService,
    private readonly sharingSync: SharingSyncService,
    private readonly userGroupsRepository: SharingUserGroupsRepository
  ) {}
  async execute({
    body,
  }: AcceptUserGroupInviteCommand): CommandHandlerResponseOf<AcceptUserGroupInviteCommand> {
    const { userGroupId } = body;
    const userGroup = await this.userGroupsRepository.getUserGroupForId(
      userGroupId
    );
    const currentUser = await this.currentUserGetter.getCurrentUserWithKeys();
    const userGroupKey = userGroup.groupKey;
    if (!userGroupKey) {
      throw new Error("Unable to get user group key");
    }
    const decryptedUserGroupKey =
      await this.sharingDecryption.decryptUserGroupKey(
        currentUser,
        userGroupKey
      );
    const acceptSignature = await this.sharingCrypto.createAcceptSignature(
      currentUser.privateKey,
      userGroupId,
      decryptedUserGroupKey
    );
    await firstValueFrom(
      this.serverApiClient.v1.sharingUserdevice.acceptUserGroup({
        acceptSignature,
        groupId: userGroupId,
        provisioningMethod: ProvisioningMethod.USER,
        revision: userGroup.revision,
      })
    );
    await this.sharingSync.scheduleSync();
    return success(undefined);
  }
}
