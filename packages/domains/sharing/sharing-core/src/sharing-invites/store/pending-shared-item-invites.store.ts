import { z } from "zod";
import { PendingSharedItemInviteSchema } from "@dashlane/sharing-contracts";
import { defineStore, StoreCapacity } from "@dashlane/framework-application";
import { UseCaseScope } from "@dashlane/framework-contracts";
import { PassthroughCodec } from "@dashlane/framework-services";
export const PendingSharedItemInvitesStateSchema = z.array(
  PendingSharedItemInviteSchema
);
export type PendingSharedItemInvitesState = z.infer<
  typeof PendingSharedItemInvitesStateSchema
>;
const isPendingSharedItemInvitesState = (
  x: unknown
): x is PendingSharedItemInvitesState => {
  return PendingSharedItemInvitesStateSchema.safeParse(x).success;
};
export class PendingSharedItemInvitesStore extends defineStore<
  PendingSharedItemInvitesState,
  PendingSharedItemInvitesState
>({
  persist: true,
  storage: {
    initialValue: [],
    typeGuard: isPendingSharedItemInvitesState,
    schemaVersion: 1,
  },
  scope: UseCaseScope.User,
  storeName: "pending-shared-items-invites-state",
  storeTypeGuard: isPendingSharedItemInvitesState,
  codec: PassthroughCodec,
  isCache: true,
  capacity: StoreCapacity.Unlimited,
}) {}
