import { z } from "zod";
import { PendingInviteSchema } from "@dashlane/sharing-contracts";
import { defineStore, StoreCapacity } from "@dashlane/framework-application";
import { UseCaseScope } from "@dashlane/framework-contracts";
import { PassthroughCodec } from "@dashlane/framework-services";
export const PendingUserGroupInvitesStateSchema = z.array(PendingInviteSchema);
export type PendingUserGroupInvitesState = z.infer<
  typeof PendingUserGroupInvitesStateSchema
>;
const isPendingUserGroupInvitesState = (
  x: unknown
): x is PendingUserGroupInvitesState => {
  return PendingUserGroupInvitesStateSchema.safeParse(x).success;
};
export class PendingUserGroupInvitesStore extends defineStore<
  PendingUserGroupInvitesState,
  PendingUserGroupInvitesState
>({
  persist: true,
  storage: {
    initialValue: [],
    typeGuard: isPendingUserGroupInvitesState,
    schemaVersion: 1,
  },
  scope: UseCaseScope.User,
  storeName: "pending-user-group-invites-state",
  storeTypeGuard: isPendingUserGroupInvitesState,
  codec: PassthroughCodec,
  isCache: true,
  capacity: StoreCapacity.Unlimited,
}) {}
