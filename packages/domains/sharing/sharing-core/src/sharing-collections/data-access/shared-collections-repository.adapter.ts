import { map, Observable } from "rxjs";
import { Injectable } from "@dashlane/framework-application";
import { safeCast, success } from "@dashlane/framework-types";
import {
  Permission,
  SharedCollection,
  SharedCollectionRole,
  Status,
} from "@dashlane/sharing-contracts";
import { SharedCollectionsRepository } from "../handlers/common/shared-collections.repository";
import { SharedCollectionsStore } from "../store/shared-collections.store";
import { SharedCollectionState } from "./shared-collections.state";
export const mapToLegacyCollection = ({
  id,
  name,
  revision,
  publicKey,
  privateKey,
}: SharedCollectionState) => ({
  uuid: id,
  name,
  revision,
  publicKey,
  privateKey,
});
@Injectable()
export class SharedCollectionsRepositoryAdapter
  implements SharedCollectionsRepository
{
  public constructor(private readonly store: SharedCollectionsStore) {}
  public async getCollectionsByIds(ids: string[]): Promise<SharedCollection[]> {
    const state = await this.store.getState();
    return ids.reduce((collections, collectionId) => {
      const collection = state.collections[collectionId];
      if (collection) {
        collections.push(mapToLegacyCollection(collection));
      }
      return collections;
    }, safeCast<SharedCollection[]>([]));
  }
  public async getCollections() {
    const state = await this.store.getState();
    return Object.values(state.collections).map((coll) =>
      mapToLegacyCollection(coll)
    );
  }
  public collections$(): Observable<SharedCollection[]> {
    return this.store.state$.pipe(
      map((state) =>
        Object.values(state.collections).reduce((acc, coll) => {
          if (coll.isAccepted) {
            acc.push(mapToLegacyCollection(coll));
          }
          return acc;
        }, safeCast<SharedCollection[]>([]))
      )
    );
  }
  public collection$(id: string): Observable<SharedCollection | undefined> {
    return this.collections$().pipe(
      map((collections) =>
        collections.find((collection) => collection.uuid === id)
      )
    );
  }
  public async getCollection(collectionId: string) {
    const state = await this.store.getState();
    const collection = state.collections[collectionId];
    if (!collection) {
      return undefined;
    }
    return mapToLegacyCollection(collection);
  }
  public async updateCollections() {}
  public getGroupRoleInCollection$(collectionId: string, groupId?: string) {
    return this.store.state$.pipe(
      map((collectionState) => {
        const { sharedCollectionsAccess } = collectionState;
        const sharedCollectionAccess = sharedCollectionsAccess[collectionId];
        if (!sharedCollectionAccess) {
          throw new Error("Shared collection not found");
        }
        const targetedUserGroup = sharedCollectionAccess.userGroups.find(
          (group) => group.id === groupId
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
    return this.store.state$.pipe(
      map((collectionState) => {
        const { sharedCollectionsAccess } = collectionState;
        const users = collectionIds.flatMap((collectionId) => {
          const targetedCollection = sharedCollectionsAccess[collectionId];
          if (!targetedCollection) {
            return [];
          }
          return sharedCollectionsAccess[collectionId].users.map((user) => ({
            id: user.name,
            label: user.name,
            status: user.status ?? Status.Pending,
            permission: user.permission,
          }));
        });
        const userGroups = collectionIds.flatMap((collectionId) => {
          const targetedCollection = sharedCollectionsAccess[collectionId];
          if (!targetedCollection) {
            return [];
          }
          return sharedCollectionsAccess[collectionId].userGroups.map(
            (group) => ({
              id: group.id,
              label: group.name,
              status: group.status ?? Status.Pending,
              permission: group.permission,
            })
          );
        });
        return success({ userGroups, users });
      })
    );
  }
}
