import { pipe } from "rxjs";
import { distinctUntilChanged, map } from "rxjs/operators";
import { UserGroupDownload } from "@dashlane/sharing/types/serverResponse";
import { SharingCapacity } from "@dashlane/communication";
import { myAcceptedUserGroupsSelector } from "Sharing/2/Services/selectors";
import { sortedSharedItemIdsSelector } from "Sharing/2/Services/selectors/sorted-shared-item-ids.selector";
import { sharingCapacitySelector } from "Sharing/2/Services/selectors/sharing-capacity.selector";
import { StateOperator } from "Shared/Live";
export const allSharedItemIds$ = (): StateOperator<string[]> => {
  const selector = sortedSharedItemIdsSelector;
  return pipe(map(selector), distinctUntilChanged());
};
export const myAcceptedUserGroups$ = (): StateOperator<UserGroupDownload[]> => {
  const selector = myAcceptedUserGroupsSelector;
  return pipe(map(selector), distinctUntilChanged());
};
export const sharingCapacity$ = (): StateOperator<SharingCapacity> => {
  const selector = sharingCapacitySelector;
  return pipe(map(selector), distinctUntilChanged());
};
