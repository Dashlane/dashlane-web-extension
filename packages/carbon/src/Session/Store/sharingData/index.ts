import { SharingData } from "Session/Store/sharingData/types";
import {
  SHARING_DATA_ITEMS_UPDATED,
  SharingDataUpdatedAction,
  USER_GROUPS_UPDATED,
  UserGroupsUpdatedAction,
} from "Session/Store/sharingData/actions";
export default (state = getEmptyState(), action: any): SharingData => {
  switch (action.type) {
    case SHARING_DATA_ITEMS_UPDATED:
      const { sharingData } = action as SharingDataUpdatedAction;
      return { ...sharingData };
    case USER_GROUPS_UPDATED:
      const { userGroups } = action as UserGroupsUpdatedAction;
      return {
        ...state,
        ...{ userGroups },
      };
    default:
      return state;
  }
};
export function getEmptyState(): SharingData {
  return {
    items: [],
    itemGroups: [],
    userGroups: [],
  };
}
