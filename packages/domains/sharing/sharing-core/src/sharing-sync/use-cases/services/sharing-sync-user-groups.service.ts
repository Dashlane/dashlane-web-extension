import {
  PendingInvite,
  RevisionSummary,
  SharingUserGroup,
  Status,
} from "@dashlane/sharing-contracts";
import { UserGroupDownload } from "@dashlane/server-sdk/v1";
import { safeCast } from "@dashlane/framework-types";
import { Injectable } from "@dashlane/framework-application";
import { CurrentUserWithKeyPair } from "../../../sharing-carbon-helpers";
import { SharingUserGroupsRepository } from "../../../sharing-recipients/services/user-groups.repository";
import { determineUpdatesFromSummary } from "./determine-updates-from-summary";
import { PendingInvitesService } from "../../../sharing-invites/services/pending-invites.service";
import { SharingSyncValidationService } from "./sharing-sync-validation.service";
@Injectable()
export class SharingSyncUserGroupsService {
  public constructor(
    private readonly userGroupsRepo: SharingUserGroupsRepository,
    private readonly validationService: SharingSyncValidationService,
    private readonly pendingInvitesService: PendingInvitesService
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
    return {
      newUserGroupIds,
      updateUserGroupIds,
      unchangedUserGroups,
      isUserGroupsSyncNeeded:
        updateUserGroupIds.length ||
        Object.keys(currentUserGroups).length !== userGroupsSummary.length,
    };
  }
  public async syncUserGroups(
    updatedUserGroups: UserGroupDownload[],
    unchangedUserGroups: SharingUserGroup[],
    currentUser: CurrentUserWithKeyPair
  ) {
    const { validatedUserGroups, pendingInvites } =
      await updatedUserGroups.reduce(
        async (result, group) => {
          if (group.type !== "users") {
            return result;
          }
          const validationResult =
            await this.validationService.isUserGroupValid(group, currentUser);
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
    this.userGroupsRepo.setUserGroups(
      unchangedUserGroups.concat(
        validatedUserGroups.map((group) =>
          this.mapToUserGroupStateModel(group, currentUser.login)
        )
      )
    );
    const unchangedUserGroupIds = unchangedUserGroups.map(
      (group) => group.groupId
    );
    const existingPendingInvites =
      await this.pendingInvitesService.getUserGroupInvites();
    const newPendingList = existingPendingInvites
      .filter((invite) => unchangedUserGroupIds.includes(invite.id))
      .concat(pendingInvites);
    this.pendingInvitesService.setUserGroupInvites(newPendingList);
  }
  private mapToUserGroupStateModel(
    userGroup: SharingUserGroup,
    currentUserId: string
  ): SharingUserGroup {
    const { groupId, name, revision, users, privateKey, publicKey } = userGroup;
    const acceptedUsers: string[] = [];
    const allUsers: string[] = [];
    let groupKey = "";
    users.forEach((user) => {
      if (user.status === Status.Accepted) {
        acceptedUsers.push(user.userId);
      }
      if (user.userId === currentUserId) {
        groupKey = user.groupKey ?? "";
      }
      allUsers.push(user.userId);
    });
    return {
      groupId,
      name,
      revision,
      acceptedUsers,
      publicKey,
      privateKey,
      groupKey,
      allUsers,
      users: [],
    };
  }
}
