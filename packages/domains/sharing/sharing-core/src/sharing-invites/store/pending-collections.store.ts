import { z } from "zod";
import { defineStore, StoreCapacity } from "@dashlane/framework-application";
import { UseCaseScope } from "@dashlane/framework-contracts";
import {
  SharedCollection,
  SharedCollectionSchema,
} from "@dashlane/sharing-contracts";
export const PendingCollectionsState = z.object({
  pendingCollections: z.array(SharedCollectionSchema),
});
export type PendingCollectionsState = {
  pendingCollections: SharedCollection[];
};
const isPendingSharedCollectionsState = (
  state: unknown
): state is PendingCollectionsState => {
  return PendingCollectionsState.safeParse(state).success;
};
export class PendingCollectionsStore extends defineStore<
  PendingCollectionsState,
  PendingCollectionsState
>({
  capacity: StoreCapacity._010KB,
  persist: false,
  scope: UseCaseScope.User,
  storeName: "pending-shared-collections-state",
  storeTypeGuard: isPendingSharedCollectionsState,
  initialValue: {
    pendingCollections: [],
  },
}) {}
