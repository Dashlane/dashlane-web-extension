import { combineLatestWith, filter, map, Observable } from "rxjs";
import {
  IQueryHandler,
  QueryHandler,
  QueryHandlerResponseOf,
} from "@dashlane/framework-application";
import { UserDownload } from "@dashlane/server-sdk/v1";
import {
  getSuccess,
  isFailure,
  isSuccess,
  success,
} from "@dashlane/framework-types";
import { SessionClient } from "@dashlane/session-contracts";
import { GetSharingUsersQuery } from "@dashlane/sharing-contracts";
import { RecipientItemGroupsService } from "../../services/recipient-item-groups.service";
import { RecipientsInCollectionsService } from "../../services/recipients-in-collections-service";
@QueryHandler(GetSharingUsersQuery)
export class GetSharingUsersQueryHandler
  implements IQueryHandler<GetSharingUsersQuery>
{
  constructor(
    private itemGroupsGetter: RecipientItemGroupsService,
    private recipientsInCollectionsService: RecipientsInCollectionsService,
    private readonly sessionClient: SessionClient
  ) {}
  execute({
    body,
  }: GetSharingUsersQuery): QueryHandlerResponseOf<GetSharingUsersQuery> {
    return this.itemGroupsGetter.getForSpaceId(body.spaceId).pipe(
      combineLatestWith(
        this.getCurrentUserLogin(),
        this.recipientsInCollectionsService.getUsersAndGroupsInCollectionsInSpace(
          body.spaceId
        )
      ),
      map(([itemGroups, currentUserLogin, usersAndGroupsInColls]) => {
        if (isFailure(usersAndGroupsInColls)) {
          throw new Error("Error when retrieving users in collections");
        }
        const usersWithCountMap = new Map();
        itemGroups.forEach((itemGroup) => {
          itemGroup.users?.forEach((user: UserDownload) => {
            if (
              user.userId === currentUserLogin ||
              !["accepted", "pending"].includes(user.status ?? "")
            ) {
              return;
            }
            const previousCount = usersWithCountMap.has(user.userId)
              ? usersWithCountMap.get(user.userId).itemCount
              : 0;
            usersWithCountMap.set(user.userId, {
              id: user.userId,
              itemCount: previousCount + 1,
            });
          });
        });
        const collectionsUserList =
          getSuccess(usersAndGroupsInColls).users || [];
        collectionsUserList.forEach((user) => {
          if (
            user.id === currentUserLogin ||
            !["accepted", "pending"].includes(user.status)
          ) {
            return;
          }
          const previousCount = usersWithCountMap.has(user.id)
            ? usersWithCountMap.get(user.id).itemCount
            : 0;
          usersWithCountMap.set(user.id, {
            id: user.id,
            itemCount: previousCount + 1,
          });
        });
        const userList = Array.from(usersWithCountMap.values());
        const sortedUserList = userList.sort((a, b) =>
          body.sortDirection === "ascend"
            ? a.id.localeCompare(b.id)
            : b.id.localeCompare(b.id)
        );
        return success(sortedUserList);
      })
    );
  }
  private getCurrentUserLogin(): Observable<string | undefined> {
    return this.sessionClient.queries
      .selectedOpenedSession()
      .pipe(filter(isSuccess), map(getSuccess));
  }
}
