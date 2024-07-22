import { Module } from "@dashlane/framework-application";
import { SharingCommonServerGateway } from "./gateway/sharing-common-server.gateway";
import { SharingItemGroupsService } from "./services/sharing-item-groups.service";
import { SharingSyncService } from "./services/sharing-sync.service";
import { SharingUserGroupsService } from "./services/sharing-user-groups.service";
import { SharingUsersService } from "./services/sharing-users.service";
import { SharingCryptoModule } from "../sharing-crypto";
import { WebServicesModule } from "@dashlane/framework-dashlane-application";
import { SharingCarbonHelpersModule } from "../sharing-carbon-helpers";
import { SharingCommonGateway } from "./services/sharing.gateway";
@Module({
  sharedModuleName: "sharing-common",
  providers: [
    SharingItemGroupsService,
    SharingSyncService,
    SharingUserGroupsService,
    SharingUsersService,
    {
      provide: SharingCommonGateway,
      useClass: SharingCommonServerGateway,
    },
  ],
  exports: [
    SharingItemGroupsService,
    SharingSyncService,
    SharingUserGroupsService,
    SharingUsersService,
    SharingCommonGateway,
  ],
  imports: [SharingCryptoModule, WebServicesModule, SharingCarbonHelpersModule],
})
export class SharingCommonModule {}
