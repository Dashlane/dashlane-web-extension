import { defineModuleApi } from "@dashlane/framework-contracts";
import {
  AcceptCollectionInviteCommand,
  AcceptSharedItemInviteCommand,
  AcceptUserGroupInviteCommand,
  RefuseCollectionInviteCommand,
  RefuseItemGroupInviteCommand,
  RefuseUserGroupInviteCommand,
  UpdatePendingCollectionsCommand,
} from "./commands";
import {
  GetInvitesQuery,
  GetPendingCollectionsQuery,
  HasInvitesQuery,
} from "./queries";
export const sharingInvitesApi = defineModuleApi({
  name: "sharingInvites" as const,
  commands: {
    AcceptUserGroupInviteCommand,
    AcceptSharedItemInviteCommand,
    AcceptCollectionInviteCommand,
    RefuseCollectionInviteCommand,
    RefuseItemGroupInviteCommand,
    RefuseUserGroupInviteCommand,
    UpdatePendingCollectionsCommand,
  },
  events: {},
  queries: {
    GetInvitesQuery,
    GetPendingCollectionsQuery,
    HasInvitesQuery,
  },
});
