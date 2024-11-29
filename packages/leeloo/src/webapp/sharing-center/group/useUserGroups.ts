import {
  CarbonQueryResult,
  useCarbonEndpoint,
} from "@dashlane/carbon-api-consumers";
import {
  ListResults,
  SortDirection,
  UserGroupDataQuery,
  UserGroupDataQueryRequest,
  UserGroupView,
} from "@dashlane/communication";
import { carbonConnector } from "../../../libs/carbon/connector";
export function useUserGroups(
  sortDirection: SortDirection,
  spaceId: string | null
): CarbonQueryResult<ListResults<UserGroupView>> {
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
  const queryParam: UserGroupDataQueryRequest = {
    dataQuery,
    spaceId: spaceId,
  };
  const liveParam = btoa(JSON.stringify(queryParam));
  const userGroups: CarbonQueryResult<ListResults<UserGroupView>> =
    useCarbonEndpoint(
      {
        queryConfig: {
          query: carbonConnector.getUserGroups,
          queryParam,
        },
        liveConfig: {
          live: carbonConnector.liveUserGroups,
          liveParam,
        },
      },
      [sortDirection, spaceId]
    );
  return userGroups;
}
