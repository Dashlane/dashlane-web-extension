import { from, map, switchMap, take } from "rxjs";
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
  GetAllAcceptedGroupsQuery,
  SortDirection,
} from "@dashlane/sharing-contracts";
import { SharingUserGroupsRepository } from "../../services/user-groups.repository";
import { FeatureFlipsClient } from "@dashlane/framework-contracts";
import {
  CarbonLegacyClient,
  UserGroupDataQuery,
} from "@dashlane/communication";
@QueryHandler(GetAllAcceptedGroupsQuery)
export class GetAllAcceptedGroupsQueryHandler
  implements IQueryHandler<GetAllAcceptedGroupsQuery>
{
  constructor(
    private userGroupsRepo: SharingUserGroupsRepository,
    private carbonLegacyClient: CarbonLegacyClient,
    private readonly featureFlips: FeatureFlipsClient,
    private readonly context: RequestContext
  ) {}
  execute(): QueryHandlerResponseOf<GetAllAcceptedGroupsQuery> {
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
          ? this.executeWithGrapheneState$()
          : this.executeWithCarbonState$();
      })
    );
  }
  private executeWithGrapheneState$(): QueryHandlerResponseOf<GetAllAcceptedGroupsQuery> {
    return from(this.userGroupsRepo.getUserGroups()).pipe(
      map((allUserGroups) => {
        const userGroups = [];
        const currentUserLogin =
          this.context.get<string>(FrameworkRequestContextValues.UserName) ??
          "";
        for (const group in allUserGroups) {
          const groupData = allUserGroups[group];
          if (groupData.acceptedUsers?.includes(currentUserLogin)) {
            userGroups.push({
              id: groupData.groupId,
              name: groupData.name,
              users: groupData.acceptedUsers,
            });
          }
        }
        return success(userGroups);
      })
    );
  }
  private executeWithCarbonState$(): QueryHandlerResponseOf<GetAllAcceptedGroupsQuery> {
    const dataQuery: UserGroupDataQuery = {
      sortToken: {
        sortCriteria: [
          {
            field: "name",
            direction: SortDirection.Ascend,
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
