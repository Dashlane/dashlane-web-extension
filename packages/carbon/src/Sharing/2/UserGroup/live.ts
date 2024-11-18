import { pipe } from "rxjs";
import { distinctUntilChanged, map } from "rxjs/operators";
import {
  ListResults,
  UserGroupDataQueryRequest,
  UserGroupView,
} from "@dashlane/communication";
import { parseToken } from "Libs/Query";
import { StateOperator } from "Shared/Live";
import { createLiveUserGroupsSelector } from "Sharing/2/UserGroup/selectors";
import { State } from "Store";
import { sameBatch } from "Libs/Pagination/same-batch";
export const userGroups$ = (
  token: string
): StateOperator<ListResults<UserGroupView>> => {
  const dataQueryRequest: UserGroupDataQueryRequest = parseToken(token);
  const querySelector: (state: State) => ListResults<UserGroupView> =
    createLiveUserGroupsSelector(dataQueryRequest.spaceId)(
      dataQueryRequest.dataQuery
    );
  return pipe(
    map(querySelector),
    distinctUntilChanged(
      (r1, r2) =>
        sameBatch(r1.items, r2.items) && r1.matchingCount === r2.matchingCount
    )
  );
};
