import { defineStore, StoreCapacity } from "@dashlane/framework-application";
import { safeCast } from "@dashlane/framework-types";
import { PassthroughCodec } from "@dashlane/framework-services";
import { UseCaseScope } from "@dashlane/framework-contracts";
import {
  SharedAccessCollectionState,
  SharedCollectionsState,
  SharedCollectionsStateSchema,
  SharedCollectionState,
} from "../data-access/shared-collections.state";
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
      sharedCollectionsAccess: safeCast<
        Record<string, SharedAccessCollectionState>
      >({}),
    },
    typeGuard: isSharedCollectionState,
    schemaVersion: 3,
    migrateStorageSchema: () => {
      return {
        collections: {},
        sharedCollectionsAccess: {},
      };
    },
  },
  capacity: StoreCapacity.Unlimited,
  codec: PassthroughCodec,
  isCache: true,
}) {}
