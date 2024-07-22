import {
  CommandHandler,
  type CommandHandlerResponseOf,
  type ICommandHandler,
} from "@dashlane/framework-application";
import { ServerApiClient } from "@dashlane/framework-dashlane-application";
import { success } from "@dashlane/framework-types";
import { AcceptUserGroupInviteCommand } from "@dashlane/sharing-contracts";
import {
  CurrentUserWithKeysGetterService,
  UserGroupsGetterService,
} from "../../../sharing-carbon-helpers";
import { SharingSyncService } from "../../../sharing-common";
import {
  SharingCryptographyService,
  SharingDecryptionService,
} from "../../../sharing-crypto";
import { firstValueFrom } from "rxjs";
import { ProvisioningMethod } from "@dashlane/server-sdk/v1";
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
    private readonly userGroupGetter: UserGroupsGetterService
  ) {}
  async execute({
    body,
  }: AcceptUserGroupInviteCommand): CommandHandlerResponseOf<AcceptUserGroupInviteCommand> {
    const { userGroupId } = body;
    const userGroupData = await this.userGroupGetter.getForGroupIds([
      userGroupId,
    ]);
    if (!userGroupData.length) {
      throw new Error(
        `Failed to retrieve user group for pending user group invite with id ${userGroupId}`
      );
    }
    const currentUser = await this.currentUserGetter.getCurrentUserWithKeys();
    const currentUserFromGroup = userGroupData[0].users.find(
      (user) => user.userId === currentUser.login
    );
    const userGroupKey = currentUserFromGroup?.groupKey;
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
        revision: userGroupData[0].revision,
      })
    );
    await this.sharingSync.scheduleSync();
    return success(undefined);
  }
}
