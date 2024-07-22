import {
  combineLatestWith,
  distinctUntilChanged,
  firstValueFrom,
  map,
} from "rxjs";
import { shallowEqualObjects } from "shallow-equal";
import { IQueryHandler, QueryHandler } from "@dashlane/framework-application";
import {
  getSuccess,
  isFailure,
  isSuccess,
  mapSuccessResultObservable,
  success,
} from "@dashlane/framework-types";
import { SessionClient } from "@dashlane/session-contracts";
import {
  GetSharingStatusForItemQuery,
  Status,
} from "@dashlane/sharing-contracts";
import {
  ItemGroupsGetterService,
  UserGroupsGetterService,
} from "../../../sharing-carbon-helpers";
@QueryHandler(GetSharingStatusForItemQuery)
export class GetSharingStatusForItemQueryHandler
  implements IQueryHandler<GetSharingStatusForItemQuery>
{
  constructor(
    private sessionClient: SessionClient,
    private itemGroupGetter: ItemGroupsGetterService,
    private userGroupsGetter: UserGroupsGetterService
  ) {}
  private async getCurrentUserLogin() {
    return await firstValueFrom(
      this.sessionClient.queries.selectedOpenedSession().pipe(
        mapSuccessResultObservable((login) => {
          return success(login);
        })
      )
    );
  }
  execute({ body }: GetSharingStatusForItemQuery) {
    const { itemId } = body;
    return this.itemGroupGetter.getForItemId(itemId).pipe(
      combineLatestWith(
        this.userGroupsGetter.get(),
        this.getCurrentUserLogin()
      ),
      map(([itemGroupResult, userGroups, userLoginResult]) => {
        if (isFailure(itemGroupResult)) {
          throw new Error(
            "Error when retrieving item group to check sharing status"
          );
        }
        const itemGroup = getSuccess(itemGroupResult);
        if (!itemGroup) {
          return {
            isShared: false,
            isSharedViaUserGroup: false,
          } as const;
        }
        if (!isSuccess(userLoginResult)) {
          throw new Error(
            "Error when trying to get user login to check sharing status for item"
          );
        }
        const myGroupIds = userGroups
          .filter(({ users }) =>
            users.some(
              (user) =>
                user.userId === userLoginResult.data &&
                user.status === Status.Accepted
            )
          )
          .map(({ groupId }) => groupId);
        const isSharedViaUserGroup =
          itemGroup.groups?.some(
            ({ groupId, status }) =>
              myGroupIds.includes(groupId) && status === "accepted"
          ) ?? false;
        return { isShared: true, isSharedViaUserGroup } as const;
      }),
      distinctUntilChanged(shallowEqualObjects),
      map(success)
    );
  }
}
