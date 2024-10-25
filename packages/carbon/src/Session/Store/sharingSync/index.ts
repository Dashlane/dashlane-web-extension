import { PendingItemGroup, PendingUserGroup } from "@dashlane/communication";
import { Action } from "Store";
export interface SharingSyncState {
  pendingItemGroups: PendingItemGroup[];
  pendingUserGroups: PendingUserGroup[];
}
export const UPDATE_ALL_PENDING = "UPDATE_ALL_PENDING";
export interface UpdateAllPendingAction extends Action {
  pendingItemGroups: PendingItemGroup[];
  pendingUserGroups: PendingUserGroup[];
}
export const updateAllPendingAction = (
  pendingItemGroups: PendingItemGroup[],
  pendingUserGroups: PendingUserGroup[]
): UpdateAllPendingAction => ({
  type: UPDATE_ALL_PENDING,
  pendingItemGroups,
  pendingUserGroups,
});
export const SET_ALL_PENDING = "SET_ALL_PENDING";
export interface SetAllPendingAction extends Action {
  pendingItemGroups: PendingItemGroup[];
  pendingUserGroups: PendingUserGroup[];
}
export const setAllPendingAction = (
  pendingItemGroups: PendingItemGroup[],
  pendingUserGroups: PendingUserGroup[]
): SetAllPendingAction => ({
  type: SET_ALL_PENDING,
  pendingItemGroups,
  pendingUserGroups,
});
export interface SetElementsAsSeenAction extends Action {
  pendingItemGroupIds: string[];
  pendingUserGroupIds: string[];
}
export default (
  state = getEmptySharingSyncState(),
  action: any
): SharingSyncState => {
  switch (action.type) {
    case UPDATE_ALL_PENDING: {
      const { pendingUserGroups, pendingItemGroups } =
        action as UpdateAllPendingAction;
      const updatedPendingItemGroups = mergeUpdate(
        state.pendingItemGroups,
        pendingItemGroups,
        "itemGroupId"
      );
      const updatedPendingUserGroups = mergeUpdate(
        state.pendingUserGroups,
        pendingUserGroups,
        "groupId"
      );
      return {
        pendingUserGroups: updatedPendingUserGroups,
        pendingItemGroups: updatedPendingItemGroups,
      };
    }
    case SET_ALL_PENDING: {
      const { pendingUserGroups, pendingItemGroups } =
        action as SetAllPendingAction;
      return { pendingItemGroups, pendingUserGroups };
    }
    default:
      return state;
  }
};
export function getEmptySharingSyncState(): SharingSyncState {
  return {
    pendingItemGroups: [],
    pendingUserGroups: [],
  };
}
type Pending = PendingItemGroup | PendingUserGroup;
function mergeUpdate<TPending extends Pending>(
  state: TPending[],
  update: TPending[],
  idKey: string
): TPending[] {
  const updateIds = update.map((element) => element[idKey]);
  const stateIds = state.map((element) => element[idKey]);
  const isInUpdate = (element: Pending) => updateIds.includes(element[idKey]);
  const isInState = (element: Pending) => stateIds.includes(element[idKey]);
  const toUpdateElements = state.filter(isInUpdate);
  const newElements = update.filter((element) => !isInState(element));
  const updatedStateElements = toUpdateElements.map((element: TPending) => {
    const updatedElement = update.find(
      (updateElement: TPending) => updateElement[idKey] === element[idKey]
    );
    if (!updatedElement) {
      return element;
    }
    return updatedElement;
  });
  return [...newElements, ...updatedStateElements];
}
