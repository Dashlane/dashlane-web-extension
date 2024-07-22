import { combineLatestWith, map, of } from "rxjs";
import {
  FrameworkRequestContextValues,
  Injectable,
  RequestContext,
} from "@dashlane/framework-application";
import { mapSuccessObservable, success } from "@dashlane/framework-types";
import {
  Permission,
  SharedCollectionRole,
  SharingItemsClient,
  Status,
} from "@dashlane/sharing-contracts";
import { UserGroupsGetterService } from "../../../sharing-carbon-helpers";
import { SharedCollectionsRepository } from "./shared-collections.repository";
@Injectable()
export class SharingCollectionAccessService {
  public constructor(
    private userGroupGetter: UserGroupsGetterService,
    private collectionsRepository: SharedCollectionsRepository,
    private context: RequestContext,
    private sharingItemsClient: SharingItemsClient
  ) {}
  public getUserRoleInCollection$(collectionId: string, userId?: string) {
    const currentUserLogin = this.getCurrentUserLogin();
    return this.userGroupGetter.getCarbonUserGroups$().pipe(
      combineLatestWith(this.collectionsRepository.collection$(collectionId)),
      map(([userGroups, collection]) => {
        if (!collection) {
          throw new Error("Shared collection not found");
        }
        const targetUserOrGroup = userId ? userId : currentUserLogin;
        const userInCollection = collection.users?.find(
          (user) => user.login === targetUserOrGroup
        );
        const isUserCollectionAdmin =
          userInCollection?.permission === Permission.Admin &&
          userInCollection.status === Status.Accepted;
        const myUserGroupIds = userGroups
          .filter((group) =>
            group.users.some(
              (user) =>
                user.userId === targetUserOrGroup &&
                user.status === Status.Accepted
            )
          )
          .map((group) => group.groupId);
        const myCollectionUserGroups = collection.userGroups?.filter((group) =>
          myUserGroupIds.includes(group.uuid)
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
  public getGroupRoleInCollection$(collectionId: string, groupId?: string) {
    return this.collectionsRepository.collection$(collectionId).pipe(
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
  getCurrentUserLogin(): string | undefined {
    return this.context.get<string>(FrameworkRequestContextValues.UserName);
  }
}
