import { pipe } from "rxjs";
import { distinctUntilChanged, map } from "rxjs/operators";
import {
  ListResults,
  MemberPermission,
  SharingUserDataQueryRequest,
  SharingUserView,
} from "@dashlane/communication";
import {
  createLiveSharingUsersSelector,
  getSharingUserPermissionLevelSelector,
} from "Sharing/2/SharingUser/selectors";
import { StateOperator } from "Shared/Live";
import { State } from "Store";
import { parseToken } from "Libs/Query";
import { sameBatch } from "Libs/Pagination/same-batch";
export const sharingUsers$ = (
  token: string
): StateOperator<ListResults<SharingUserView>> => {
  const dataQueryRequest: SharingUserDataQueryRequest = parseToken(token);
  const querySelector: (state: State) => ListResults<SharingUserView> =
    createLiveSharingUsersSelector(dataQueryRequest.spaceId)(
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
export const sharingUserPermissionLevel$ = (
  token: string
): StateOperator<MemberPermission | undefined> => {
  const selector = getSharingUserPermissionLevelSelector(parseToken(token));
  return pipe(map(selector), distinctUntilChanged());
};
