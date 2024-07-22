import { Injectable } from "@dashlane/framework-application";
import {
  SharingUser,
  SharingUserGroup,
  Status,
} from "@dashlane/sharing-contracts";
import { safeCast } from "@dashlane/framework-types";
import {
  SharingUserGroupsStore,
  SharingUserGroupState,
} from "../store/sharing-user-groups.store";
import { SharingUserGroupsRepository } from "../services/user-groups.repository";
@Injectable()
export class SharingUserGroupsRepositoryAdapter
  implements SharingUserGroupsRepository
{
  public constructor(private userGroupsStore: SharingUserGroupsStore) {}
  public async getUserGroups() {
    const { userGroups, users } = await this.userGroupsStore.getState();
    return Object.keys(userGroups).reduce((acc, id) => {
      const { groupId, name, revision, allUsers, privateKey, publicKey } =
        userGroups[id];
      acc[id] = {
        groupId,
        name,
        revision,
        privateKey,
        publicKey,
        users: allUsers.map((userId) => users[userId]),
      };
      return acc;
    }, safeCast<Record<string, SharingUserGroup>>({}));
  }
  public setUserGroups(userGroups: SharingUserGroup[]) {
    const newUserGroupsState = userGroups.reduce(
      (newState, { groupId, name, revision, users, privateKey, publicKey }) => {
        newState.userGroups[groupId] = {
          groupId,
          name,
          revision,
          acceptedUsers: users.reduce((acceptedUserIds, user) => {
            if (user.status === Status.Accepted) {
              acceptedUserIds.push(user.userId);
            }
            return acceptedUserIds;
          }, safeCast<string[]>([])),
          publicKey,
          privateKey,
          allUsers: users.map((user) => user.userId),
        };
        users.forEach((user) => (newState.users[user.userId] = user));
        return newState;
      },
      {
        userGroups: safeCast<Record<string, SharingUserGroupState>>({}),
        users: safeCast<Record<string, SharingUser>>({}),
      }
    );
    this.userGroupsStore.set(newUserGroupsState);
  }
  async getUserGroup(id: string) {
    const { userGroups, users } = await this.userGroupsStore.getState();
    const userGroup = userGroups[id];
    if (!userGroup) {
      return null;
    }
    const { groupId, name, revision, allUsers, privateKey, publicKey } =
      userGroup;
    return {
      groupId,
      name,
      revision,
      privateKey,
      publicKey,
      users: allUsers.map((userId) => users[userId]),
    };
  }
  async getUserGroupsForIds(ids: string[]) {
    const { userGroups, users } = await this.userGroupsStore.getState();
    return ids.reduce((matchingUserGroups, id) => {
      const userGroup = userGroups[id];
      if (userGroup) {
        const { groupId, name, revision, allUsers, privateKey, publicKey } =
          userGroup;
        matchingUserGroups.push({
          groupId,
          name,
          revision,
          privateKey,
          publicKey,
          users: allUsers.map((userId) => users[userId]),
        });
      }
      return matchingUserGroups;
    }, safeCast<SharingUserGroup[]>([]));
  }
}
