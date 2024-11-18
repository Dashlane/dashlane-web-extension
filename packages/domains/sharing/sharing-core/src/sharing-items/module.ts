import { Module } from "@dashlane/framework-application";
import { WebServicesModule } from "@dashlane/framework-dashlane-application";
import {
  sharingItemsApi,
  SharingItemsFeatureFlips,
} from "@dashlane/sharing-contracts";
import {
  GetIsLastAdminForItemQueryHandler,
  GetPermissionForItemQueryHandler,
  GetPermissionForItemsQueryHandler,
  GetSharedAccessForItemIdsQueryHandler,
  GetSharedAccessQueryHandler,
  GetSharedItemForIdQueryHandler,
  GetSharedItemsForItemIdsQueryHandler,
  GetSharedItemsQueryHandler,
  GetSharingStatusForItemQueryHandler,
  GetSharingStatusForItemsQueryHandler,
  GetSharingTeamLoginsQueryHandler,
  GetUserSharedVaultItemsQueryHandler,
  IsSharingAllowedQueryHandler,
  SharedAccessForItemQueryHandler,
  SharedItemsIdsQueryHandler,
  ShareItemsErrorQueryHandler,
  SharingEnabledQueryHandler,
} from "./handlers/queries";
import {
  RefuseSharedItemBeforeDeletionCommandHandler,
  RefuseSharedItemCommandHandler,
  RemoteControlSharedItemsCommandHandler,
  RevokeSharedItemCommandHandler,
  ShareItemsCommandHandler,
  UpdateSharedItemContentCommandHandler,
  UpdateSharedItemPermissionCommandHandler,
} from "./handlers/commands";
import { SharingCarbonHelpersModule } from "../sharing-carbon-helpers";
import { SharingCollectionsModule } from "../sharing-collections";
import { SharedItemsRepository } from "./handlers/common/shared-items-repository";
import { SharingCommonModule } from "../sharing-common";
import { SharingCryptoModule, SharingRecipientsModule } from "..";
import { SharingItemsGateway } from "./handlers/common/sharing-items.gateway";
import { SharingItemsServerGateway } from "./gateway/sharing-items-server.gateway";
import { SharingItemsInvitesService } from "./handlers/commands/common/sharing-items-invites.service";
import { ShareItemsErrorsStore } from "./store/share-items-errors.store";
import { IsSharingAllowedService } from "./handlers/common/is-sharing-allowed.service";
import { ShareItemsService } from "./handlers/common/share-items.service";
import { ShareableItemsService } from "./handlers/common/shareable-items.service";
import { SharedItemsStore } from "./store/shared-items.store";
import { SharedItemsRepositoryWrapper } from "./data-adapters/shared-items-repository-wrapper";
import { SharedItemsLegacyRepositoryAdapter } from "./data-adapters/shared-items-repository-legacy.adapter";
import { SharedItemsRepositoryAdapter } from "./data-adapters/shared-items-repository.adapter";
import { SharedItemsService } from "./handlers/common/shared-items.service";
@Module({
  api: sharingItemsApi,
  providers: [
    SharingItemsInvitesService,
    IsSharingAllowedService,
    ShareItemsService,
    SharedItemsService,
    ShareableItemsService,
    SharedItemsLegacyRepositoryAdapter,
    SharedItemsRepositoryAdapter,
    {
      provide: SharedItemsRepository,
      useClass: SharedItemsRepositoryWrapper,
    },
    {
      provide: SharingItemsGateway,
      useClass: SharingItemsServerGateway,
    },
  ],
  exports: [SharedItemsRepository],
  stores: [ShareItemsErrorsStore, SharedItemsStore],
  handlers: {
    commands: {
      updateSharedItemPermission: UpdateSharedItemPermissionCommandHandler,
      revokeSharedItem: RevokeSharedItemCommandHandler,
      refuseSharedItem: RefuseSharedItemCommandHandler,
      refuseSharedItemBeforeDeletion:
        RefuseSharedItemBeforeDeletionCommandHandler,
      remoteControlSharedItems: RemoteControlSharedItemsCommandHandler,
      shareItems: ShareItemsCommandHandler,
      updateSharedItemContent: UpdateSharedItemContentCommandHandler,
    },
    events: {},
    queries: {
      getSharedAccess: GetSharedAccessQueryHandler,
      getSharedAccessForItemIds: GetSharedAccessForItemIdsQueryHandler,
      getSharedItems: GetSharedItemsQueryHandler,
      getSharedItemForId: GetSharedItemForIdQueryHandler,
      isSharingAllowed: IsSharingAllowedQueryHandler,
      getSharingTeamLogins: GetSharingTeamLoginsQueryHandler,
      sharingEnabled: SharingEnabledQueryHandler,
      getSharedItemsForItemIds: GetSharedItemsForItemIdsQueryHandler,
      getSharingStatusForItem: GetSharingStatusForItemQueryHandler,
      getSharingStatusForItems: GetSharingStatusForItemsQueryHandler,
      getPermissionForItem: GetPermissionForItemQueryHandler,
      getPermissionForItems: GetPermissionForItemsQueryHandler,
      getIsLastAdminForItem: GetIsLastAdminForItemQueryHandler,
      sharedAccessForItem: SharedAccessForItemQueryHandler,
      getUserSharedVaultItems: GetUserSharedVaultItemsQueryHandler,
      sharedItemsIds: SharedItemsIdsQueryHandler,
      shareItemsErrors: ShareItemsErrorQueryHandler,
    },
  },
  imports: [
    WebServicesModule,
    SharingCarbonHelpersModule,
    SharingCommonModule,
    SharingCollectionsModule,
    SharingCryptoModule,
    SharingRecipientsModule,
  ],
  requiredFeatureFlips: [
    SharingItemsFeatureFlips.SharingItemsGrapheneMigrationDev,
  ],
})
export class SharingItemsModule {}
