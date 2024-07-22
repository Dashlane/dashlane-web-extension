import { Module } from "@dashlane/framework-application";
import { sharingInvitesApi } from "@dashlane/sharing-contracts";
import {
  CryptographyModule,
  WebServicesModule,
} from "@dashlane/framework-dashlane-application";
import {
  GetInvitesQueryHandler,
  HasInvitesQueryHandler,
  PendingCollectionsQueryHandler,
} from "./handlers/queries";
import {
  AcceptCollectionInviteCommandHandler,
  AcceptSharedItemInviteCommandHandler,
  AcceptUserGroupInviteCommandHandler,
  RefuseCollectionInviteCommandHandler,
  RefuseItemGroupInviteCommandHandler,
  RefuseUserGroupInviteCommandHandler,
  UpdatePendingCollectionsCommandHandler,
} from "./handlers/commands";
import { PendingCollectionsStore } from "./store/pending-collections.store";
import { SharingCryptoModule } from "../sharing-crypto";
import { SharingCommonModule } from "../sharing-common";
import { SharingCarbonHelpersModule } from "../sharing-carbon-helpers";
import { PendingCollectionInvitesStore } from "./store/pending-collection-invites.store";
import { PendingSharedItemInvitesStore } from "./store/pending-shared-item-invites.store";
import { PendingUserGroupInvitesStore } from "./store/pending-user-group-invites.store";
import { PendingInvitesService } from "./services/pending-invites.service";
import { SharedItemContentGetterService } from "./handlers/common/shared-item-content-getter.service";
@Module({
  api: sharingInvitesApi,
  stores: [
    PendingCollectionsStore,
    PendingCollectionInvitesStore,
    PendingSharedItemInvitesStore,
    PendingUserGroupInvitesStore,
  ],
  handlers: {
    commands: {
      acceptUserGroupInvite: AcceptUserGroupInviteCommandHandler,
      acceptCollectionInvite: AcceptCollectionInviteCommandHandler,
      acceptSharedItemInvite: AcceptSharedItemInviteCommandHandler,
      refuseCollectionInvite: RefuseCollectionInviteCommandHandler,
      refuseItemGroupInvite: RefuseItemGroupInviteCommandHandler,
      refuseUserGroupInvite: RefuseUserGroupInviteCommandHandler,
      updatePendingCollections: UpdatePendingCollectionsCommandHandler,
    },
    events: {},
    queries: {
      getInvites: GetInvitesQueryHandler,
      getPendingCollections: PendingCollectionsQueryHandler,
      hasInvites: HasInvitesQueryHandler,
    },
  },
  imports: [
    WebServicesModule,
    CryptographyModule,
    SharingCryptoModule,
    SharingCommonModule,
    SharingCarbonHelpersModule,
  ],
  requiredFeatureFlips: [
    "audit_logs_sharing",
    "send_activity_log",
    "sharingVault_web_Share_Collections_with_limited_Rights_Items_dev",
  ],
  providers: [PendingInvitesService, SharedItemContentGetterService],
  exports: [PendingInvitesService],
})
export class SharingInvitesModule {}
