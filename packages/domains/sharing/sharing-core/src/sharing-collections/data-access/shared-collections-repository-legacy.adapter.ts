import { map, Observable } from "rxjs";
import { Injectable } from "@dashlane/framework-application";
import { success } from "@dashlane/framework-types";
import {
  Permission,
  SharedCollection,
  SharedCollectionAccess,
  SharedCollectionRole,
} from "@dashlane/sharing-contracts";
import { SharedCollectionsRepository } from "../handlers/common/shared-collections.repository";
import { SharedCollectionsLegacyStore } from "../store/shared-collections-legacy.store";
export const toSharedCollectionAccess = (
  sharedCollection: SharedCollection
): SharedCollectionAccess => {
  return {
    users:
      sharedCollection.users?.map((user) => ({
        id: user.login,
        name: user.login,
        permission: user.permission,
        status: user.status,
      })) ?? [],
    userGroups:
      sharedCollection.userGroups?.map((group) => ({
        id: group.uuid,
        name: group.name,
        permission: group.permission,
        status: group.status,
      })) ?? [],
  };
};
@Injectable()
export class SharedCollectionsRepositoryLegacyAdapter
  implements SharedCollectionsRepository
{
  public constructor(private readonly store: SharedCollectionsLegacyStore) {}
  public async getCollectionsByIds(ids: string[]): Promise<SharedCollection[]> {
    const state = await this.store.getState();
    return state.sharedCollections.filter((c) => ids.includes(c.uuid));
  }
  public async getCollections() {
    const state = await this.store.getState();
    return state.sharedCollections;
  }
  public collections$(): Observable<SharedCollection[]> {
    return this.store.state$.pipe(map((state) => state.sharedCollections));
  }
  public collection$(id: string): Observable<SharedCollection | undefined> {
    return this.collections$().pipe(
      map((collections) =>
        collections.find((collection) => collection.uuid === id)
      )
    );
  }
  public async getCollection(id: string) {
    const state = await this.store.getState();
    const collection = state.sharedCollections.find((c) => c.uuid === id);
    if (!collection) {
      return undefined;
    }
    return collection;
  }
  public async updateCollections(collections: SharedCollection[]) {
    await this.store.set({
      sharedCollections: [...collections],
    });
  }
  public getGroupRoleInCollection$(collectionId: string, groupId?: string) {
    return this.collection$(collectionId).pipe(
      map((collection) => {
        if (!collection) {
          throw new Error("Shared collection not found");
        }
        const targetedUserGroup = collection.userGroups?.find(
          (group) => group.uuid === groupId
        );
        const isTargetGroupAdmin =
          targetedUserGroup?.permission === Permission.Admin;
        return isTargetGroupAdmin
          ? SharedCollectionRole.Manager
          : SharedCollectionRole.Editor;
      })
    );
  }
  public usersAndGroupsInCollection(collectionIds: string[]) {
    return this.collections$().pipe(
      map((sharedCollections) => {
        const targetCollections: SharedCollection[] = sharedCollections.filter(
          (collection: SharedCollection) =>
            collectionIds.includes(collection.uuid)
        );
        const usersList = targetCollections.flatMap((coll) =>
          coll.users ? coll.users : []
        );
        const users = usersList.map((user) => ({
          id: user.login,
          label: user.login,
          status: user.status,
          permission: user.permission,
        }));
        const userGroupsList = targetCollections.flatMap((coll) =>
          coll.userGroups ? coll.userGroups : []
        );
        const userGroups = userGroupsList.map((group) => ({
          id: group.uuid,
          label: group.name,
          status: group.status,
          permission: group.permission,
        }));
        return success({ userGroups, users });
      })
    );
  }
}
