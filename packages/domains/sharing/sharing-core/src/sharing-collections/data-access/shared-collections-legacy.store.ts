import { defineStore, StoreCapacity } from "@dashlane/framework-application";
import { UseCaseScope } from "@dashlane/framework-contracts";
import {
  SharedCollectionsLegacyState,
  SharedCollectionsStateLegacySchema,
} from "./shared-collections.state";
const isSharedCollectionState = (
  state: unknown
): state is SharedCollectionsLegacyState => {
  return SharedCollectionsStateLegacySchema.safeParse(state).success;
};
export class SharedCollectionsLegacyStore extends defineStore<
  SharedCollectionsLegacyState,
  SharedCollectionsLegacyState
>({
  capacity: StoreCapacity._010KB,
  persist: false,
  scope: UseCaseScope.User,
  storeName: "collections-store",
  storeTypeGuard: isSharedCollectionState,
  initialValue: { sharedCollections: [] },
}) {}
