import { z } from "zod";
import { defineStore, StoreCapacity } from "@dashlane/framework-application";
import { UseCaseScope } from "@dashlane/framework-contracts";
import { PassthroughCodec } from "@dashlane/framework-services";
import {
  SharedAccessSchema,
  SharedItemSchema,
} from "@dashlane/sharing-contracts";
const SharedVaultItemEntrySchema = z.object({
  sharedItemId: z.string(),
  vaultItemId: z.string(),
  revision: z.number(),
  savedToVault: z.boolean().optional(),
});
export type SharedVaultItemEntry = z.infer<typeof SharedVaultItemEntrySchema>;
export const SharedItemsStateSchema = z.object({
  indexPerVaultItemId: z.record(SharedVaultItemEntrySchema),
  sharedItems: z.record(SharedItemSchema),
  sharedAccess: z.record(SharedAccessSchema),
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
      sharedAccess: {},
    },
    typeGuard: isSharedItemsState,
    schemaVersion: 4,
    migrateStorageSchema: () => {
      return {
        indexPerVaultItemId: {},
        sharedItems: {},
        sharedAccess: {},
      };
    },
  },
  scope: UseCaseScope.User,
  storeName: "shared-items-state",
  storeTypeGuard: isSharedItemsState,
  codec: PassthroughCodec,
  isCache: true,
  capacity: StoreCapacity.Unlimited,
}) {}
