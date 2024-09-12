import { UseCaseScope } from "@dashlane/framework-contracts";
import { defineStore } from "../../state/store/define-store";
import { StoreCapacity } from "../../state/store/define-store.types";
export interface ActiveUserState {
  userName: string | undefined;
}
const isActiveUserState = (x: unknown): x is ActiveUserState => {
  if (!x || typeof x !== "object") {
    return false;
  }
  return "userName" in x;
};
export class ActiveUserStore extends defineStore<ActiveUserState>({
  initialValue: { userName: undefined },
  persist: false,
  scope: UseCaseScope.Device,
  storeName: "active-user-store",
  storeTypeGuard: isActiveUserState,
  capacity: StoreCapacity._001KB,
}) {}
