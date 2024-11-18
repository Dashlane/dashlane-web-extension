import { Module } from "@dashlane/framework-application";
import { sharingRecipientsApi } from "@dashlane/sharing-contracts";
import {
  GetAllAcceptedGroupsQueryHandler,
  GetSharingGroupByIdQueryHandler,
  GetSharingGroupsWithItemCountQueryHandler,
  GetSharingUsersQueryHandler,
} from "./handlers/queries";
import { SharingCarbonHelpersModule } from "../sharing-carbon-helpers";
import { RecipientsInCollectionsService } from "./services/recipients-in-collections-service";
import { RecipientSharedItemService } from "./services/recipient-shared-item.service";
import { SharingUserGroupsStore } from "./store/sharing-user-groups.store";
import { SharingUserGroupsRepository } from "./services/user-groups.repository";
import { SharingUserGroupsRepositoryWrapper } from "./adapters/user-groups-repository-wrapper";
import { SharingUserGroupsRepositoryAdapter } from "./adapters/user-groups-repository.adapter";
import { SharingUserGroupsRepositoryLegacyAdapter } from "./adapters/user-groups-repository-legacy.adapter";
@Module({
  api: sharingRecipientsApi,
  providers: [
    RecipientSharedItemService,
    RecipientsInCollectionsService,
    SharingUserGroupsRepositoryAdapter,
    SharingUserGroupsRepositoryLegacyAdapter,
    {
      provide: SharingUserGroupsRepository,
      useClass: SharingUserGroupsRepositoryWrapper,
    },
  ],
  stores: [SharingUserGroupsStore],
  handlers: {
    commands: {},
    events: {},
    queries: {
      getAllAcceptedGroups: GetAllAcceptedGroupsQueryHandler,
      getSharingUsers: GetSharingUsersQueryHandler,
      getSharingGroupsWithItemCount: GetSharingGroupsWithItemCountQueryHandler,
      getSharingGroupById: GetSharingGroupByIdQueryHandler,
    },
  },
  imports: [SharingCarbonHelpersModule],
  exports: [SharingUserGroupsRepository],
})
export class SharingRecipientsModule {}
