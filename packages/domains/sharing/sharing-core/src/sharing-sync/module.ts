import { RunSharingSyncUseCase } from "./use-cases/run-sharing-sync.use-case";
import { Module } from "@dashlane/framework-application";
import { WebServicesModule } from "@dashlane/framework-dashlane-application";
import { sharingSyncApi } from "@dashlane/sharing-contracts";
import {
  SharingCollectionsModule,
  SharingCryptoModule,
  SharingInvitesModule,
  SharingItemsModule,
  SharingRecipientsModule,
} from "..";
import { SharingCarbonHelpersModule } from "../sharing-carbon-helpers";
import { SharingSyncVaultUpdatesService } from "./use-cases/services/sharing-sync-vault-updates.service";
import { SharingSyncItemsService } from "./use-cases/services/sharing-sync-items.service";
import { SharingSyncCollectionsService } from "./use-cases/services/sharing-sync-collections.service";
import { SharingSyncUserGroupsService } from "./use-cases/services/sharing-sync-user-groups.service";
@Module({
  api: sharingSyncApi,
  providers: [
    SharingSyncVaultUpdatesService,
    SharingSyncItemsService,
    SharingSyncCollectionsService,
    SharingSyncUserGroupsService,
  ],
  handlers: {
    commands: {
      runSharingSync: RunSharingSyncUseCase,
    },
    events: {},
    queries: {},
  },
  imports: [
    WebServicesModule,
    SharingCarbonHelpersModule,
    SharingCryptoModule,
    SharingRecipientsModule,
    SharingCollectionsModule,
    SharingItemsModule,
    SharingInvitesModule,
  ],
})
export class SharingSyncModule {}
