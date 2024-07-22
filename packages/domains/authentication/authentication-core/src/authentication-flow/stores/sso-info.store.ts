import { UseCaseScope } from "@dashlane/framework-contracts";
import { defineStore, StoreCapacity } from "@dashlane/framework-application";
import { PassthroughCodec } from "@dashlane/framework-services";
export interface SsoUserSettingsState {
  rememberMeForSSOPreference: boolean;
}
const isSsoInfoStore = (x: unknown): x is SsoUserSettingsState => {
  if (!x || typeof x !== "object") {
    return false;
  }
  return "rememberMeForSSOPreference" in x;
};
export class SsoUserSettingsStore extends defineStore<
  SsoUserSettingsState,
  SsoUserSettingsState
>({
  codec: PassthroughCodec,
  persist: true,
  storage: {
    initialValue: {
      rememberMeForSSOPreference: true,
    },
    schemaVersion: 1,
    typeGuard: isSsoInfoStore,
  },
  scope: UseCaseScope.Device,
  storeName: "sso-info",
  storeTypeGuard: isSsoInfoStore,
  capacity: StoreCapacity._001KB,
}) {}
