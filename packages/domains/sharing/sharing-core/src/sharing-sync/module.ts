import { RunSharingSyncUseCase } from "./use-cases/run-sharing-sync.use-case";
import { Module } from "@dashlane/framework-application";
import { WebServicesModule } from "@dashlane/framework-dashlane-application";
import {
  sharingSyncApi,
  SharingSyncFeatureFlips,
} from "@dashlane/sharing-contracts";
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
import { SharingCommonModule } from "../sharing-common";
import { SharingSyncPendingSharedItemsService } from "./use-cases/services/sharing-sync-pending-shared-items.service";
import { SharingSyncResendInvitesService } from "./use-cases/services/sharing-sync-resend-invites.service";
import { SharingSyncLastAdminService } from "./use-cases/services/sharing-sync-last-admin.service";
import { TeamAdminSharingDataStore } from "./store/team-admin-sharing-data.store";
import { SharingSyncTeamAdminSharingDataService } from "./use-cases/services/sharing-sync-team-admin-sharing-data.service";
import { SharingSyncValidationService } from "./use-cases/services/sharing-sync-validation.service";
import { GetTeamAdminSharingDataUseCase } from "./use-cases/get-team-admin-sharing-data.use-case";
@Module({
  api: sharingSyncApi,
  providers: [
    SharingSyncVaultUpdatesService,
    SharingSyncItemsService,
    SharingSyncCollectionsService,
    SharingSyncUserGroupsService,
    SharingSyncPendingSharedItemsService,
    SharingSyncResendInvitesService,
    SharingSyncLastAdminService,
    SharingSyncTeamAdminSharingDataService,
    SharingSyncValidationService,
  ],
  stores: [TeamAdminSharingDataStore],
  handlers: {
    commands: {
      runSharingSync: RunSharingSyncUseCase,
    },
    events: {},
    queries: {
      getTeamAdminSharingData: GetTeamAdminSharingDataUseCase,
    },
  },
  imports: [
    WebServicesModule,
    SharingCarbonHelpersModule,
    SharingCryptoModule,
    SharingRecipientsModule,
    SharingCollectionsModule,
    SharingItemsModule,
    SharingInvitesModule,
    SharingCommonModule,
  ],
  requiredFeatureFlips: [
    SharingSyncFeatureFlips.SharingSyncGrapheneMigrationDev,
  ],
})
export class SharingSyncModule {}
