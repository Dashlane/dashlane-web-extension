import { z } from "zod";
import { PendingInviteSchema } from "@dashlane/sharing-contracts";
import { defineStore, StoreCapacity } from "@dashlane/framework-application";
import { UseCaseScope } from "@dashlane/framework-contracts";
import { PassthroughCodec } from "@dashlane/framework-services";
export const PendingCollectionInvitesStateSchema = z.array(PendingInviteSchema);
export type PendingCollectionInvitesState = z.infer<
  typeof PendingCollectionInvitesStateSchema
>;
const isPendingCollectionInvitesState = (
  x: unknown
): x is PendingCollectionInvitesState => {
  return PendingCollectionInvitesStateSchema.safeParse(x).success;
};
export class PendingCollectionInvitesStore extends defineStore<
  PendingCollectionInvitesState,
  PendingCollectionInvitesState
>({
  persist: true,
  storage: {
    initialValue: [],
    typeGuard: isPendingCollectionInvitesState,
    schemaVersion: 1,
  },
  scope: UseCaseScope.User,
  storeName: "pending-collection-invites-state",
  storeTypeGuard: isPendingCollectionInvitesState,
  codec: PassthroughCodec,
  isCache: true,
  capacity: StoreCapacity.Unlimited,
}) {}
