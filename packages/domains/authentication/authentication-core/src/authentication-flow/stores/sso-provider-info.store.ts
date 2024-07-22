import { UseCaseScope } from "@dashlane/framework-contracts";
import { defineStore, StoreCapacity } from "@dashlane/framework-application";
import { SSOMigrationType } from "@dashlane/communication";
export interface SsoProviderInfoState {
  serviceProviderUrl?: string;
  isNitroProvider?: boolean;
  migrationType?: SSOMigrationType;
}
const isSsoInfoStore = (x: unknown): x is SsoProviderInfoState => {
  return true;
};
export class SsoProviderInfoStore extends defineStore<
  SsoProviderInfoState,
  SsoProviderInfoState
>({
  persist: false,
  initialValue: {},
  scope: UseCaseScope.Device,
  storeName: "sso-provider-info",
  storeTypeGuard: isSsoInfoStore,
  capacity: StoreCapacity._001KB,
}) {}
