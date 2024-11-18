import { combineLatestWith, map, of } from "rxjs";
import { Injectable } from "@dashlane/framework-application";
import { mapSuccessObservable, success } from "@dashlane/framework-types";
import {
  Permission,
  SharedCollectionRole,
  SharingItemsClient,
  Status,
} from "@dashlane/sharing-contracts";
import { SharedCollectionsRepository } from "./shared-collections.repository";
import { SharingUserGroupsRepository } from "../../../sharing-recipients/services/user-groups.repository";
import { SharedCollectionsStore } from "../../store/shared-collections.store";
@Injectable()
export class SharingCollectionAccessService {
  public constructor(
    private readonly collectionsRepository: SharedCollectionsRepository,
    private readonly userGroupsRepository: SharingUserGroupsRepository,
    private readonly sharingItemsClient: SharingItemsClient,
    private readonly store: SharedCollectionsStore
  ) {}
  public getUserRoleInCollectionCarbon$(
    collectionId: string,
    userId?: string,
    currentUserLogin?: string
  ) {
    const targetUser = userId ? userId : currentUserLogin;
    if (!targetUser) {
      throw new Error("No target user to get role in collection");
    }
    return this.userGroupsRepository
      .acceptedUserGroupIdsForLogin$(targetUser)
      .pipe(
        combineLatestWith(this.collectionsRepository.collection$(collectionId)),
        map(([myUserGroupIds, collection]) => {
          if (!collection) {
            throw new Error("Shared collection not found");
          }
          const userInCollection = collection.users?.find(
            (user) => user.login === targetUser
          );
          const isUserCollectionAdmin =
            userInCollection?.permission === Permission.Admin &&
            userInCollection.status === Status.Accepted;
          const myCollectionUserGroups = collection.userGroups?.filter(
            (group) => myUserGroupIds.includes(group.uuid)
          );
          const isUserGroupCollectionAdmin = myCollectionUserGroups?.some(
            (group) => group.permission === Permission.Admin
          );
          return isUserCollectionAdmin || isUserGroupCollectionAdmin
            ? SharedCollectionRole.Manager
            : SharedCollectionRole.Editor;
        })
      );
  }
  public getUserRoleInCollectionGraphene$(
    collectionId: string,
    userId?: string,
    currentUserLogin?: string
  ) {
    const targetUser = userId ? userId : currentUserLogin;
    if (!targetUser) {
      throw new Error("No target user to get role in collection");
    }
    return this?.userGroupsRepository
      .acceptedUserGroupIdsForLogin$(targetUser)
      .pipe(
        combineLatestWith(this.store.state$),
        map(([myUserGroupIds, collectionState]) => {
          const { sharedCollectionsAccess } = collectionState;
          const sharedCollectionAccess = sharedCollectionsAccess[collectionId];
          if (!sharedCollectionAccess) {
            throw new Error("Shared collection not found");
          }
          const userInCollection = sharedCollectionAccess.users.find(
            (user) => user.name === targetUser
          );
          const isUserCollectionAdmin =
            userInCollection?.permission === Permission.Admin &&
            userInCollection.status === Status.Accepted;
          const myCollectionUserGroups =
            sharedCollectionAccess.userGroups.filter((group) =>
              myUserGroupIds.includes(group.id)
            );
          const isUserGroupCollectionAdmin = myCollectionUserGroups.some(
            (group) => group.permission === Permission.Admin
          );
          return isUserCollectionAdmin || isUserGroupCollectionAdmin
            ? SharedCollectionRole.Manager
            : SharedCollectionRole.Editor;
        })
      );
  }
  public getGroupRoleInCollection$(collectionId: string, groupId?: string) {
    return this.collectionsRepository.getGroupRoleInCollection$(
      collectionId,
      groupId
    );
  }
  public canShareItems(itemIds: string[]) {
    if (itemIds.length === 0) {
      return of(success(true));
    }
    return this.sharingItemsClient.queries
      .getSharedItemsForItemIds({ itemIds })
      .pipe(
        mapSuccessObservable((result) =>
          result.sharedItems.every(
            (item) => item.permission === Permission.Admin
          )
        )
      );
  }
}
