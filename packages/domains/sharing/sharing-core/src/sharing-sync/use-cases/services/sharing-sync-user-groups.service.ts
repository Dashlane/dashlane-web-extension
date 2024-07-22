import {
  PendingInvite,
  RevisionSummary,
  SharingUserGroup,
  Status,
} from "@dashlane/sharing-contracts";
import { UserGroupDownload } from "@dashlane/server-sdk/v1";
import { safeCast } from "@dashlane/framework-types";
import { SharingCryptographyService, SharingDecryptionService } from "../../..";
import { CurrentUserWithKeyPair } from "../../../sharing-carbon-helpers";
import { SharingUserGroupsRepository } from "../../../sharing-recipients/services/user-groups.repository";
import { determineUpdatesFromSummary } from "./determine-updates-from-summary";
import { PendingInvitesService } from "../../../sharing-invites/services/pending-invites.service";
export class SharingSyncUserGroupsService {
  public constructor(
    private userGroupsRepo: SharingUserGroupsRepository,
    private sharingCrypto: SharingCryptographyService,
    private sharingDecryption: SharingDecryptionService,
    private pendingInvitesService: PendingInvitesService
  ) {}
  public async getUserGroupChangesFromSummary(
    userGroupsSummary: RevisionSummary[]
  ) {
    const currentUserGroups = await this.userGroupsRepo.getUserGroups();
    const {
      newIds: newUserGroupIds,
      updatedIds: updateUserGroupIds,
      unchanged: unchangedUserGroups,
    } = determineUpdatesFromSummary(userGroupsSummary, currentUserGroups);
    return { newUserGroupIds, updateUserGroupIds, unchangedUserGroups };
  }
  public async syncUserGroups(
    updatedUserGroups: UserGroupDownload[],
    unchangedUserGroups: SharingUserGroup[],
    currentUser: CurrentUserWithKeyPair
  ) {
    const { validatedUserGroups, pendingInvites } =
      await updatedUserGroups.reduce(
        async (result, group) => {
          const validationResult = await this.isUserGroupValid(
            group,
            currentUser
          );
          const currentResult = await result;
          if (validationResult) {
            currentResult.validatedUserGroups.push(group);
          }
          if (typeof validationResult !== "boolean") {
            const { referrer, permission } = validationResult;
            currentResult.pendingInvites.push({
              referrer,
              permission,
              id: group.groupId,
              name: group.name,
            });
          }
          return result;
        },
        Promise.resolve({
          validatedUserGroups: safeCast<SharingUserGroup[]>([]),
          pendingInvites: safeCast<PendingInvite[]>([]),
        })
      );
    if (validatedUserGroups.length) {
      this.userGroupsRepo.setUserGroups(
        unchangedUserGroups.concat(validatedUserGroups)
      );
    }
    if (pendingInvites.length) {
      this.pendingInvitesService.setUserGroupInvites(pendingInvites);
    }
  }
  private async isUserGroupValid(
    userGroup: UserGroupDownload,
    currentUser: CurrentUserWithKeyPair
  ) {
    const { publicKey, login } = currentUser;
    const meAsGroupMember = userGroup.users.find(
      (user) => user.userId === login
    );
    if (!meAsGroupMember?.groupKey?.length) {
      return false;
    }
    if (meAsGroupMember.status === Status.Pending) {
      return meAsGroupMember;
    }
    if (meAsGroupMember.status !== Status.Accepted) {
      return false;
    }
    if (!meAsGroupMember.acceptSignature) {
      return false;
    }
    const userGroupKey =
      await this.sharingDecryption.decryptResourceKeyViaUserMember(
        { encryptedResourceKey: meAsGroupMember.groupKey },
        currentUser
      );
    if (!userGroupKey) {
      return false;
    }
    return this.sharingCrypto.verifyAcceptSignature(
      publicKey,
      meAsGroupMember.acceptSignature,
      userGroup.groupId,
      userGroupKey
    );
  }
}
