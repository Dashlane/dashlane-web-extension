import { Injectable } from "@dashlane/framework-application";
import {
  PendingInvite,
  PendingSharedItemInvite,
} from "@dashlane/sharing-contracts";
import { PendingCollectionInvitesStore } from "../store/pending-collection-invites.store";
import { PendingSharedItemInvitesStore } from "../store/pending-shared-item-invites.store";
import { PendingUserGroupInvitesStore } from "../store/pending-user-group-invites.store";
@Injectable()
export class PendingInvitesService {
  public constructor(
    private readonly collectionsStore: PendingCollectionInvitesStore,
    private readonly userGroupsStore: PendingUserGroupInvitesStore,
    private readonly itemsStore: PendingSharedItemInvitesStore
  ) {}
  public setCollectionInvites(invites: PendingInvite[]) {
    this.collectionsStore.set(invites);
  }
  public setUserGroupInvites(invites: PendingInvite[]) {
    this.userGroupsStore.set(invites);
  }
  public setSharedItemInvites(invites: PendingSharedItemInvite[]) {
    this.itemsStore.set(invites);
  }
  public getUserGroupInvites() {
    return this.userGroupsStore.getState();
  }
  public getSharedItemsInvites() {
    return this.itemsStore.getState();
  }
  public getCollectionsInvites() {
    return this.collectionsStore.getState();
  }
}
