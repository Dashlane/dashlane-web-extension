import { map } from "rxjs";
import { Injectable } from "@dashlane/framework-application";
import { SharingUserGroup } from "@dashlane/sharing-contracts";
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
    const { userGroups } = await this.userGroupsStore.getState();
    return Object.keys(userGroups).reduce((acc, id) => {
      const {
        groupId,
        name,
        revision,
        acceptedUsers,
        privateKey,
        publicKey,
        groupKey,
      } = userGroups[id];
      acc[id] = {
        groupId,
        name,
        revision,
        privateKey,
        publicKey,
        users: [],
        acceptedUsers,
        groupKey,
      };
      return acc;
    }, safeCast<Record<string, SharingUserGroup>>({}));
  }
  public setUserGroups(userGroups: SharingUserGroup[]) {
    const newState = userGroups.reduce((acc, group) => {
      acc[group.groupId] = {
        ...group,
        allUsers: group.allUsers ?? [],
        acceptedUsers: group.acceptedUsers ?? [],
      };
      return acc;
    }, safeCast<Record<string, SharingUserGroupState>>({}));
    this.userGroupsStore.set({ userGroups: newState });
  }
  public async getUserGroup(id: string) {
    const { userGroups } = await this.userGroupsStore.getState();
    const userGroup = userGroups[id];
    if (!userGroup) {
      return null;
    }
    const {
      groupId,
      name,
      revision,
      acceptedUsers,
      privateKey,
      publicKey,
      groupKey,
    } = userGroup;
    return {
      groupId,
      name,
      revision,
      privateKey,
      publicKey,
      groupKey,
      users: [],
      acceptedUsers,
    };
  }
  public async getUserGroupsForIds(ids: string[]) {
    const { userGroups } = await this.userGroupsStore.getState();
    return ids.reduce((matchingUserGroups, id) => {
      const userGroup = userGroups[id];
      if (userGroup) {
        const {
          groupId,
          name,
          revision,
          acceptedUsers,
          privateKey,
          publicKey,
          groupKey,
        } = userGroup;
        matchingUserGroups.push({
          groupId,
          name,
          revision,
          privateKey,
          publicKey,
          groupKey,
          users: [],
          acceptedUsers,
        });
      }
      return matchingUserGroups;
    }, safeCast<SharingUserGroup[]>([]));
  }
  public async getUserGroupForId(id: string) {
    const userGroups = await this.getUserGroupsForIds([id]);
    if (!userGroups.length) {
      throw new Error(`Failed to retrieve user group by id`);
    }
    return userGroups[0];
  }
  public acceptedUserGroupIdsForLogin$(login: string) {
    return this.userGroupsStore.state$.pipe(
      map((state) => {
        return Object.values(state.userGroups)
          .filter((group) => group.acceptedUsers.includes(login))
          .map((group) => group.groupId);
      })
    );
  }
}
