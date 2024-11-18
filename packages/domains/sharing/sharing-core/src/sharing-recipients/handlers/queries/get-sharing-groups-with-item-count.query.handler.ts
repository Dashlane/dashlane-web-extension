import { combineLatestWith, map, switchMap, take } from "rxjs";
import {
  FrameworkRequestContextValues,
  IQueryHandler,
  QueryHandler,
  QueryHandlerResponseOf,
  RequestContext,
} from "@dashlane/framework-application";
import {
  getSuccess,
  isFailure,
  isSuccess,
  success,
} from "@dashlane/framework-types";
import {
  GetSharingGroupsWithItemCountQuery,
  SharedAccessEntry,
  SharingGroup,
  SharingItemsClient,
  SortDirection,
} from "@dashlane/sharing-contracts";
import { SharingUserGroupsRepository } from "../../services/user-groups.repository";
import { FeatureFlipsClient } from "@dashlane/framework-contracts";
import {
  CarbonLegacyClient,
  UserGroupDataQuery,
} from "@dashlane/communication";
@QueryHandler(GetSharingGroupsWithItemCountQuery)
export class GetSharingGroupsWithItemCountQueryHandler
  implements IQueryHandler<GetSharingGroupsWithItemCountQuery>
{
  constructor(
    private readonly sharingItemsClient: SharingItemsClient,
    private userGroupsRepo: SharingUserGroupsRepository,
    private carbonLegacyClient: CarbonLegacyClient,
    private readonly featureFlips: FeatureFlipsClient,
    private readonly context: RequestContext
  ) {}
  execute({
    body,
  }: GetSharingGroupsWithItemCountQuery): QueryHandlerResponseOf<GetSharingGroupsWithItemCountQuery> {
    const { sortDirection } = body;
    const { userFeatureFlip } = this.featureFlips.queries;
    return userFeatureFlip({
      featureFlip: "sharingVault_web_sharingSyncGrapheneMigration_dev",
    }).pipe(
      take(1),
      switchMap((isNewSharingSyncEnabledResult) => {
        const isNewSharingSyncEnabled = isSuccess(isNewSharingSyncEnabledResult)
          ? !!getSuccess(isNewSharingSyncEnabledResult)
          : false;
        return isNewSharingSyncEnabled
          ? this.executeWithGrapheneState$(sortDirection)
          : this.executeWithCarbonState$(sortDirection);
      })
    );
  }
  private executeWithGrapheneState$(
    sortDirection: SortDirection
  ): QueryHandlerResponseOf<GetSharingGroupsWithItemCountQuery> {
    return this.sharingItemsClient.queries.getSharedAccess().pipe(
      combineLatestWith(this.userGroupsRepo.getUserGroups()),
      map(([sharedAccessResult, userGroups]) => {
        if (isFailure(sharedAccessResult)) {
          throw new Error("Unable to find shared access data.");
        }
        const sharedAccess = getSuccess(sharedAccessResult).sharedAccess;
        const currentUserLogin =
          this.context.get<string>(FrameworkRequestContextValues.UserName) ??
          "";
        const groupsWithCountMap: Map<string, SharingGroup> = new Map();
        Object.values(userGroups).forEach((group) => {
          if (group.acceptedUsers?.includes(currentUserLogin)) {
            groupsWithCountMap.set(group.groupId, {
              id: group.groupId,
              name: group.name,
              users: group.acceptedUsers,
              itemCount: 0,
            });
          }
        });
        sharedAccess.forEach((itemAccess) => {
          itemAccess.userGroups.forEach((groupAccess: SharedAccessEntry) => {
            if (groupAccess.status !== "accepted") {
              return;
            }
            const userGroup = groupsWithCountMap.get(groupAccess.id);
            if (!userGroup) {
              return;
            }
            const previousCount = userGroup.itemCount || 0;
            groupsWithCountMap.set(userGroup.id, {
              id: userGroup.id,
              name: userGroup.name,
              users: userGroup.users,
              itemCount: previousCount + 1,
            });
          });
        });
        const groupList = Array.from(groupsWithCountMap.values());
        const sortedGroupList = groupList.sort((a, b) =>
          sortDirection === SortDirection.Ascend
            ? a.name.localeCompare(b.name)
            : b.name.localeCompare(a.name)
        );
        return success(sortedGroupList);
      })
    );
  }
  private executeWithCarbonState$(
    sortDirection: SortDirection
  ): QueryHandlerResponseOf<GetSharingGroupsWithItemCountQuery> {
    const dataQuery: UserGroupDataQuery = {
      sortToken: {
        sortCriteria: [
          {
            field: "name",
            direction: sortDirection,
          },
        ],
        uniqField: "id",
      },
      filterToken: { filterCriteria: [] },
    };
    const queryParam = {
      dataQuery,
      spaceId: "",
    };
    return this.carbonLegacyClient.queries.getUserGroups(queryParam).pipe(
      map((carbonGroups) => {
        if (isFailure(carbonGroups)) {
          throw new Error("Unable to carbon user group data.");
        }
        const userGroups = getSuccess(carbonGroups).items.map((group) => ({
          id: group.id,
          itemCount: group.itemCount,
          name: group.name,
          users: group.users.map((user) => user.id),
        }));
        return success(userGroups);
      })
    );
  }
}
