import { UseCaseScope } from "@dashlane/framework-contracts";
import { defineStore, StoreCapacity } from "@dashlane/framework-application";
import { PassthroughCodec } from "@dashlane/framework-services";
export interface CollectionsState {
  isCredentialCategoriesMigrated: {
    [key: string]: boolean;
  };
}
const isCollectionStateGuard = (state: unknown): state is CollectionsState => {
  return true;
};
export class CollectionsStore extends defineStore<
  CollectionsState,
  CollectionsState
>({
  persist: true,
  scope: UseCaseScope.Device,
  storeName: "collections-store",
  storeTypeGuard: isCollectionStateGuard,
  capacity: StoreCapacity._001KB,
  codec: PassthroughCodec,
  storage: {
    schemaVersion: 3,
    initialValue: { isCredentialCategoriesMigrated: {} },
    typeGuard: isCollectionStateGuard,
    migrateStorageSchema: () => ({ isCredentialCategoriesMigrated: {} }),
  },
}) {}
