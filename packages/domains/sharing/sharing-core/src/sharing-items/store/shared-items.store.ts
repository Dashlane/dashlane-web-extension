import { z } from "zod";
import { defineStore, StoreCapacity } from "@dashlane/framework-application";
import { UseCaseScope } from "@dashlane/framework-contracts";
import { PassthroughCodec } from "@dashlane/framework-services";
import { SharedItemSchema } from "@dashlane/sharing-contracts";
export const SharedItemsStateSchema = z.object({
  indexPerVaultItemId: z.record(
    z.object({ id: z.string(), revision: z.number() })
  ),
  sharedItems: z.record(SharedItemSchema),
});
export type SharedItemsState = z.infer<typeof SharedItemsStateSchema>;
const isSharedItemsState = (x: unknown): x is SharedItemsState => {
  return SharedItemsStateSchema.safeParse(x).success;
};
export class SharedItemsStore extends defineStore<
  SharedItemsState,
  SharedItemsState
>({
  persist: true,
  storage: {
    initialValue: {
      indexPerVaultItemId: {},
      sharedItems: {},
    },
    typeGuard: isSharedItemsState,
    schemaVersion: 1,
  },
  scope: UseCaseScope.User,
  storeName: "shared-items-state",
  storeTypeGuard: isSharedItemsState,
  codec: PassthroughCodec,
  isCache: true,
  capacity: StoreCapacity.Unlimited,
}) {}
