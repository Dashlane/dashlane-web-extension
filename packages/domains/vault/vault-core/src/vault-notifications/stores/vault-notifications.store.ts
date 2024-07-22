import { defineStore, StoreCapacity } from "@dashlane/framework-application";
import { UseCaseScope } from "@dashlane/framework-contracts";
import { PassthroughCodec } from "@dashlane/framework-services";
export interface VaultNotificationsStatusDeprecated {
  isCollectionGuidedIntroEnabled: boolean;
}
export interface VaultNotificationsStatus {
  isCollectionGuidedIntroEnabled: boolean;
  hasSeenFreeUserFrozenState: boolean;
}
const isVaultNotificationsStore = (
  x: unknown
): x is VaultNotificationsStatus => {
  if (!x || typeof x !== "object") {
    return false;
  }
  return "isCollectionGuidedIntroEnabled" in x;
};
const storeInitialValue = {
  isCollectionGuidedIntroEnabled: true,
  hasSeenFreeUserFrozenState: false,
};
export class VaultNotificationsStore extends defineStore<
  VaultNotificationsStatus,
  VaultNotificationsStatus
>({
  persist: true,
  storage: {
    initialValue: storeInitialValue,
    typeGuard: isVaultNotificationsStore,
    schemaVersion: 2,
    migrateStorageSchema: () => ({
      isCollectionGuidedIntroEnabled: true,
      hasSeenFreeUserFrozenState: false,
    }),
  },
  scope: UseCaseScope.User,
  storeName: "vault-notifications",
  capacity: StoreCapacity._001KB,
  codec: PassthroughCodec,
}) {}
