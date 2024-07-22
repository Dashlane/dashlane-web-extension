import { Module } from "@dashlane/framework-application";
import { WebServicesModule } from "@dashlane/framework-dashlane-application";
import { sharingItemsApi } from "@dashlane/sharing-contracts";
import {
  GetIsLastAdminForItemQueryHandler,
  GetItemGroupIdForItemIdQueryHandler,
  GetPermissionForItemQueryHandler,
  GetPermissionForItemsQueryHandler,
  GetSharedItemsForItemIdsQueryHandler,
  GetSharingStatusForItemQueryHandler,
  GetSharingTeamLoginsQueryHandler,
  GetUserSharedVaultItemsQueryHandler,
  IsSharingAllowedQueryHandler,
  SharedAccessForItemQueryHandler,
  SharedItemsIdsQueryHandler,
  ShareItemsErrorQueryHandler,
  SharingEnabledQueryHandler,
} from "./handlers/queries";
import {
  RefuseSharedItemCommandHandler,
  RemoteControlSharedItemsCommandHandler,
  RevokeSharedItemCommandHandler,
  ShareItemsCommandHandler,
  UpdateSharedItemPermissionCommandHandler,
} from "./handlers/commands";
import { SharingCarbonHelpersModule } from "../sharing-carbon-helpers";
import { SharingCollectionsModule } from "../sharing-collections";
import { SharedItemsRepository } from "./handlers/common/shared-items-repository";
import { SharingCommonModule } from "../sharing-common";
import { SharingCryptoModule, SharingInvitesModule } from "..";
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
@Module({
  api: sharingItemsApi,
  providers: [
    SharingItemsInvitesService,
    IsSharingAllowedService,
    ShareItemsService,
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
      remoteControlSharedItems: RemoteControlSharedItemsCommandHandler,
      shareItems: ShareItemsCommandHandler,
    },
    events: {},
    queries: {
      isSharingAllowed: IsSharingAllowedQueryHandler,
      getSharingTeamLogins: GetSharingTeamLoginsQueryHandler,
      sharingEnabled: SharingEnabledQueryHandler,
      getItemGroupIdForItemId: GetItemGroupIdForItemIdQueryHandler,
      getSharedItemsForItemIds: GetSharedItemsForItemIdsQueryHandler,
      getSharingStatusForItem: GetSharingStatusForItemQueryHandler,
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
    SharingInvitesModule,
    SharingCollectionsModule,
    SharingCryptoModule,
  ],
})
export class SharingItemsModule {}
