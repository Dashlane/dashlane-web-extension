import { defineStore, StoreCapacity } from "@dashlane/framework-application";
import { safeCast } from "@dashlane/framework-types";
import { PassthroughCodec } from "@dashlane/framework-services";
import { UseCaseScope } from "@dashlane/framework-contracts";
import {
  SharedCollectionsState,
  SharedCollectionsStateSchema,
  SharedCollectionState,
} from "./shared-collections.state";
const isSharedCollectionState = (
  state: unknown
): state is SharedCollectionsState => {
  return SharedCollectionsStateSchema.safeParse(state).success;
};
export class SharedCollectionsStore extends defineStore<
  SharedCollectionsState,
  SharedCollectionsState
>({
  persist: true,
  scope: UseCaseScope.User,
  storeName: "collections-store",
  storeTypeGuard: isSharedCollectionState,
  storage: {
    initialValue: {
      collections: safeCast<Record<string, SharedCollectionState>>({}),
    },
    typeGuard: isSharedCollectionState,
    schemaVersion: 1,
  },
  capacity: StoreCapacity.Unlimited,
  codec: PassthroughCodec,
  isCache: true,
}) {}
