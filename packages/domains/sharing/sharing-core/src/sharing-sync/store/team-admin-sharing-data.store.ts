import { defineStore, StoreCapacity } from "@dashlane/framework-application";
import { UseCaseScope } from "@dashlane/framework-contracts";
import { PassthroughCodec } from "@dashlane/framework-services";
import {
  TeamAdminSharingData,
  TeamAdminSharingDataSchema,
} from "@dashlane/sharing-contracts";
const isTeamAdminSharingData = (x: unknown): x is TeamAdminSharingData => {
  return TeamAdminSharingDataSchema.safeParse(x).success;
};
export class TeamAdminSharingDataStore extends defineStore<
  TeamAdminSharingData,
  TeamAdminSharingData
>({
  persist: true,
  storage: {
    initialValue: {},
    typeGuard: isTeamAdminSharingData,
    schemaVersion: 1,
  },
  scope: UseCaseScope.User,
  storeName: "team-admin-data-store",
  storeTypeGuard: isTeamAdminSharingData,
  codec: PassthroughCodec,
  isCache: true,
  capacity: StoreCapacity.Unlimited,
}) {}
