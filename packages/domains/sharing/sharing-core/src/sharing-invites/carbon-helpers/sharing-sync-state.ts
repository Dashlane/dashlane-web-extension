import { PendingItemGroup, PendingUserGroup } from "@dashlane/communication";
export interface SharingSyncState {
  pendingItemGroups: PendingItemGroup[];
  pendingUserGroups: PendingUserGroup[];
}
export const isSharingSyncState = (
  state: unknown
): state is SharingSyncState => {
  if (!state) {
    return false;
  }
  const item = state as Partial<SharingSyncState>;
  return !!item.pendingItemGroups && !!item.pendingUserGroups;
};
