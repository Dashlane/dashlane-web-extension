import { z } from "zod";
import { defineStore, StoreCapacity } from "@dashlane/framework-application";
import { UseCaseScope } from "@dashlane/framework-contracts";
import { PassthroughCodec } from "@dashlane/framework-services";
export const SharingUserGroupStateSchema = z.object({
  groupId: z.string(),
  name: z.string(),
  revision: z.number(),
  publicKey: z.string(),
  privateKey: z.string(),
  acceptedUsers: z.array(z.string()),
  allUsers: z.array(z.string()),
  groupKey: z.string().optional(),
});
export const SharingUserGroupsStateSchema = z.object({
  userGroups: z.record(SharingUserGroupStateSchema),
});
export type SharingUserGroupsState = z.infer<
  typeof SharingUserGroupsStateSchema
>;
export type SharingUserGroupState = z.infer<typeof SharingUserGroupStateSchema>;
const isSharingUserGroupsState = (x: unknown): x is SharingUserGroupsState => {
  return SharingUserGroupsStateSchema.safeParse(x).success;
};
export class SharingUserGroupsStore extends defineStore<
  SharingUserGroupsState,
  SharingUserGroupsState
>({
  persist: true,
  storage: {
    initialValue: { userGroups: {} },
    typeGuard: isSharingUserGroupsState,
    schemaVersion: 1,
  },
  scope: UseCaseScope.User,
  storeName: "sharing-user-groups-state",
  storeTypeGuard: isSharingUserGroupsState,
  codec: PassthroughCodec,
  isCache: true,
  capacity: StoreCapacity.Unlimited,
}) {}
