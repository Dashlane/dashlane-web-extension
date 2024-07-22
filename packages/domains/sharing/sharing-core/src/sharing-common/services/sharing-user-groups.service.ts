import { safeCast } from "@dashlane/framework-types";
import { Injectable } from "@dashlane/framework-application";
import { Permission } from "@dashlane/sharing-contracts";
import {
  CurrentUserWithKeysGetterService,
  UserGroupsGetterService,
} from "../../sharing-carbon-helpers";
import {
  ShareableResource,
  SharingUserGroupRecipient,
  UserGroupInvite,
} from "../../sharing-common";
import {
  SharingCryptographyService,
  SharingInvitesCryptoService,
} from "../../sharing-crypto";
interface UserGroupWithKeys {
  groupId: string;
  publicKey: string;
  permission: Permission;
  clearUserGroupPrivateKey: string;
}
@Injectable()
export class SharingUserGroupsService {
  public constructor(
    private userGroupsGetter: UserGroupsGetterService,
    private sharingCrypto: SharingCryptographyService,
    private sharingInvitesCrypto: SharingInvitesCryptoService,
    private currentUserGetter: CurrentUserWithKeysGetterService
  ) {}
  public async createSignedUserGroupInvites(
    groupsRecipients: SharingUserGroupRecipient[],
    resource: {
      resourceKey: ArrayBuffer;
      uuid: string;
    }
  ): Promise<UserGroupInvite[]> {
    const result = await this.createSignedUserGroupInvitesPerResource(
      groupsRecipients,
      [resource]
    );
    return result[resource.uuid];
  }
  public async createSignedUserGroupInvitesPerResource(
    groupsRecipients: SharingUserGroupRecipient[],
    resources: ShareableResource[]
  ) {
    const userGroupsWithKeys = await this.getUserGroupsWithKeys(
      groupsRecipients
    );
    const result = await Promise.all(
      resources.map(async (resource) => {
        const invites = await Promise.all(
          userGroupsWithKeys.map((userGroupWithKeys) =>
            this.createInvite(userGroupWithKeys, resource)
          )
        );
        return { resource, invites };
      })
    );
    const invitesRecord: Record<string, UserGroupInvite[]> = {};
    result.forEach(({ resource, invites }) => {
      invitesRecord[resource.uuid] = invites;
    });
    return invitesRecord;
  }
  private async getUserGroupsWithKeys(
    groupsRecipients: SharingUserGroupRecipient[]
  ) {
    const currentUser = await this.currentUserGetter.getCurrentUserWithKeys();
    const userGroups = await this.userGroupsGetter.getForGroupIds(
      groupsRecipients.map((recipient) => recipient.groupId)
    );
    return Promise.all(
      userGroups.map(async (userGroup) => {
        const permission =
          groupsRecipients.find(
            (recipient) => recipient.groupId === userGroup.groupId
          )?.permission ?? Permission.Limited;
        const currentUserFromGroup = userGroup.users.find(
          (user) => user.userId === currentUser.login
        );
        const encryptedUserGroupKey = currentUserFromGroup?.groupKey;
        if (!encryptedUserGroupKey) {
          throw new Error("Unable to get user group key.");
        }
        const clearUserGroupPrivateKey =
          await this.sharingCrypto.decryptResourceKeyToClearText(
            currentUser.privateKey,
            userGroup.privateKey,
            encryptedUserGroupKey
          );
        return {
          permission,
          groupId: userGroup.groupId,
          publicKey: userGroup.publicKey,
          clearUserGroupPrivateKey,
        };
      })
    );
  }
  private async createInvite(
    userGroupWithKeys: UserGroupWithKeys,
    resource: ShareableResource
  ) {
    const { groupId, publicKey, clearUserGroupPrivateKey, permission } =
      userGroupWithKeys;
    const { proposeSignature, acceptSignature, resourceKey } =
      await this.sharingInvitesCrypto.createSignedInvite(
        groupId,
        resource,
        publicKey,
        clearUserGroupPrivateKey
      );
    if (!resourceKey) {
      throw new Error(
        "Could not create resource key when generating user group invite for shared item"
      );
    }
    return safeCast<UserGroupInvite>({
      permission,
      proposeSignature,
      acceptSignature,
      id: groupId,
      resourceKey,
    });
  }
}
