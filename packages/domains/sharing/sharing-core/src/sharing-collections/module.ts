import { Module } from "@dashlane/framework-application";
import { sharingCollectionsApi } from "@dashlane/sharing-contracts";
import {
  CryptographyModule,
  WebServicesModule,
} from "@dashlane/framework-dashlane-application";
import {
  CreateSharedCollectionCommandHandler,
  DeleteSharedCollectionCommandHandler,
  InviteCollectionMembersCommandHandler,
  MoveCollectionItemsToBusinessSpaceCommandHandler,
  RemoveItemFromCollectionsCommandHandler,
  RenameCollectionCommandHandler,
  RevokeCollectionMembersCommandHandler,
  UpdateSharedCollectionsCommandHandler,
} from "./handlers/commands";
import {
  GetCollectionPermissionsForUserQueryHandler,
  GetCollectionRoleForGroupQueryHandler,
  GetCollectionsForUserOrGroupQueryHandler,
  GetItemIdsInSharedCollectionsQueryHandler,
  GetSharedCollectionsQueryHandler,
  SharedCollectionsWithItemsQueryHandler,
  UsersAndGroupsInCollectionQueryHandler,
} from "./handlers/queries";
import { SharedCollectionsLegacyStore } from "./data-access/shared-collections-legacy.store";
import { SharingCollectionsService } from "./handlers/common/sharing-collections.service";
import { SharingCollectionItemsService } from "./handlers/common/sharing-collection-items.service";
import { AddItemsToCollectionsCommandHandler } from "./handlers/commands/add-item-to-collections.command.handler";
import { SharedCollectionsRepositoryLegacyAdapter } from "./data-access/shared-collections-repository-legacy.adapter";
import { SharingCollectionsServerGateway } from "./gateway/sharing-collections-server.gateway";
import { SharingCryptoModule } from "../sharing-crypto";
import { SharingCommonModule } from "../sharing-common";
import { SharingCarbonHelpersModule } from "../sharing-carbon-helpers";
import { SharingCollectionsGateway } from "./handlers/common/sharing-collections.gateway";
import { UpdateCollectionMembersCommandHandler } from "./handlers/commands/update-collection-members.command.handler";
import { SharingCollectionAccessService } from "./handlers/common/shared-collection-access.service";
import { GetSharedCollectionsCountQueryHandler } from "./handlers/queries/shared-collections-count.query.handler";
import { UpdateItemPermissionsInCollectionsCommandHandler } from "./handlers/commands/update-item-permissions-in-collections.command.handler";
import { SharingCollectionInvitesService } from "./handlers/common/sharing-collections-invites.service";
import { SharedCollectionsRepository } from "./handlers/common/shared-collections.repository";
import { SharedCollectionsStore } from "./data-access/shared-collections.store";
import { SharedCollectionsRepositoryAdapter } from "./data-access/shared-collections-repository.adapter";
import { SharedCollectionsRepositoryWrapper } from "./data-access/shared-collections-repository-wrapper";
import { SharedCollectionsNewRepository } from "./handlers/common/shared-collections-new.repository";
import { SharedCollectionsNewRepositoryAdapter } from "./data-access/shared-collections-new-repository.adapter";
@Module({
  api: sharingCollectionsApi,
  stores: [SharedCollectionsStore, SharedCollectionsLegacyStore],
  providers: [
    SharingCollectionsService,
    SharingCollectionInvitesService,
    SharingCollectionAccessService,
    SharingCollectionItemsService,
    SharedCollectionsRepositoryLegacyAdapter,
    SharedCollectionsRepositoryAdapter,
    {
      provide: SharingCollectionsGateway,
      useClass: SharingCollectionsServerGateway,
    },
    {
      provide: SharedCollectionsRepository,
      useClass: SharedCollectionsRepositoryWrapper,
    },
    {
      provide: SharedCollectionsNewRepository,
      useClass: SharedCollectionsNewRepositoryAdapter,
    },
  ],
  exports: [SharedCollectionsRepository, SharedCollectionsNewRepository],
  handlers: {
    commands: {
      addItemsToCollections: AddItemsToCollectionsCommandHandler,
      createSharedCollection: CreateSharedCollectionCommandHandler,
      deleteSharedCollection: DeleteSharedCollectionCommandHandler,
      inviteCollectionMembers: InviteCollectionMembersCommandHandler,
      updateCollectionMembers: UpdateCollectionMembersCommandHandler,
      removeItemFromCollections: RemoveItemFromCollectionsCommandHandler,
      renameCollection: RenameCollectionCommandHandler,
      revokeCollectionMembers: RevokeCollectionMembersCommandHandler,
      updateSharedCollections: UpdateSharedCollectionsCommandHandler,
      updatePermissionForCollectionItem:
        UpdateItemPermissionsInCollectionsCommandHandler,
      moveCollectionItemsToBusinessSpace:
        MoveCollectionItemsToBusinessSpaceCommandHandler,
    },
    events: {},
    queries: {
      getCollectionPermissionsForUser:
        GetCollectionPermissionsForUserQueryHandler,
      getCollectionRoleForGroup: GetCollectionRoleForGroupQueryHandler,
      getCollectionsForUserOrGroup: GetCollectionsForUserOrGroupQueryHandler,
      getItemIdsInSharedCollections: GetItemIdsInSharedCollectionsQueryHandler,
      getSharedCollectionsCount: GetSharedCollectionsCountQueryHandler,
      getSharedCollections: GetSharedCollectionsQueryHandler,
      sharedCollectionsWithItems: SharedCollectionsWithItemsQueryHandler,
      usersAndGroupsInCollection: UsersAndGroupsInCollectionQueryHandler,
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
    "sharing_web_invalidSignatureAutoRevoke_prod",
    "monetization_extension_starterRepackagingCollection",
    "sharingVault_web_shareItemsGrapheneMigration_dev",
    "sharingVault_web_sharingSyncGrapheneMigration_dev",
  ],
})
export class SharingCollectionsModule {}
