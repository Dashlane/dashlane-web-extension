import { Module } from "@dashlane/framework-application";
import { sharingRecipientsApi } from "@dashlane/sharing-contracts";
import {
  GetSharingGroupsQueryHandler,
  GetSharingUsersQueryHandler,
} from "./handlers/queries";
import { SharingCarbonHelpersModule } from "../sharing-carbon-helpers";
import { RecipientsInCollectionsService } from "./services/recipients-in-collections-service";
import { RecipientItemGroupsService } from "./services/recipient-item-groups.service";
import { SharingUserGroupsStore } from "./store/sharing-user-groups.store";
import { SharingUserGroupsRepository } from "./services/user-groups.repository";
import { SharingUserGroupsRepositoryAdapter } from "./adapters/user-groups-repository.adapter";
@Module({
  api: sharingRecipientsApi,
  providers: [
    RecipientItemGroupsService,
    RecipientsInCollectionsService,
    {
      provide: SharingUserGroupsRepository,
      useClass: SharingUserGroupsRepositoryAdapter,
    },
  ],
  stores: [SharingUserGroupsStore],
  handlers: {
    commands: {},
    events: {},
    queries: {
      getSharingUsers: GetSharingUsersQueryHandler,
      getSharingGroups: GetSharingGroupsQueryHandler,
    },
  },
  imports: [SharingCarbonHelpersModule],
  exports: [SharingUserGroupsRepository],
})
export class SharingRecipientsModule {}
