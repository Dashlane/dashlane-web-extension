import { combineLatestWith, filter, map, Observable } from "rxjs";
import {
  IQueryHandler,
  QueryHandler,
  QueryHandlerResponseOf,
} from "@dashlane/framework-application";
import {
  getSuccess,
  isFailure,
  isSuccess,
  success,
} from "@dashlane/framework-types";
import { SessionClient } from "@dashlane/session-contracts";
import { GetSharingGroupsQuery } from "@dashlane/sharing-contracts";
import { RecipientItemGroupsService } from "../../services/recipient-item-groups.service";
import { UserGroupsGetterService } from "../../../sharing-carbon-helpers";
import { RecipientsInCollectionsService } from "../../services/recipients-in-collections-service";
@QueryHandler(GetSharingGroupsQuery)
export class GetSharingGroupsQueryHandler
  implements IQueryHandler<GetSharingGroupsQuery>
{
  constructor(
    private itemGroupsRecipientsGetter: RecipientItemGroupsService,
    private recipientsInCollectionsService: RecipientsInCollectionsService,
    private userGroupsGetter: UserGroupsGetterService,
    private readonly sessionClient: SessionClient
  ) {}
  execute({
    body,
  }: GetSharingGroupsQuery): QueryHandlerResponseOf<GetSharingGroupsQuery> {
    return this.itemGroupsRecipientsGetter.getForSpaceId(body.spaceId).pipe(
      combineLatestWith(
        this.getCurrentUserLogin(),
        this.userGroupsGetter.get(),
        this.recipientsInCollectionsService.getUsersAndGroupsInCollections()
      ),
      map(
        ([itemGroups, currentUserLogin, userGroups, usersAndGroupsInColls]) => {
          if (isFailure(usersAndGroupsInColls)) {
            throw new Error("Error when retrieving users in collections");
          }
          const groupsInCollections =
            getSuccess(usersAndGroupsInColls).userGroups || [];
          const acceptedUserGroups = userGroups.filter(
            (userGroup) =>
              userGroup.type === "users" &&
              userGroup.users.some(
                (user) =>
                  user.userId === currentUserLogin && user.status === "accepted"
              )
          );
          const userGroupsWithCount = acceptedUserGroups.map((userGroup) => {
            const userGroupItemGroups = itemGroups.filter((itemGroup) => {
              return (itemGroup.groups || []).some((groupInItemGroup) => {
                return (
                  groupInItemGroup.groupId === userGroup.groupId &&
                  groupInItemGroup.status === "accepted"
                );
              });
            });
            const userGroupCollections = groupsInCollections.filter(
              (groupInCollection) => groupInCollection.id === userGroup.groupId
            );
            const itemCount =
              userGroupItemGroups.length + userGroupCollections.length;
            const userGroupUsers = userGroup.users.map((user) => ({
              id: user.userId,
              permission: user.permission,
            }));
            return {
              id: userGroup.groupId,
              itemCount,
              name: userGroup.name,
              users: userGroupUsers,
            };
          });
          const sortedGroupList = userGroupsWithCount.sort((a, b) =>
            body.sortDirection === "ascend"
              ? a.name.localeCompare(b.name)
              : b.name.localeCompare(b.name)
          );
          return success(sortedGroupList);
        }
      )
    );
  }
  private getCurrentUserLogin(): Observable<string | undefined> {
    return this.sessionClient.queries
      .selectedOpenedSession()
      .pipe(filter(isSuccess), map(getSuccess));
  }
}
