import { Module } from "@dashlane/framework-application";
import { deviceRegistrationApi } from "@dashlane/authentication-contracts";
import { LocalAccountsQueryHandler } from "./handlers/queries";
import { CleanRemotelyRemovedProfilesCommandHandler } from "./handlers/commands";
import { RegisterDeviceCommandHandler } from "./handlers/commands/register-device-command.handler";
import { RegisterDeviceService } from "./services/register-device.service";
import { WebServicesModule } from "@dashlane/framework-dashlane-application";
@Module({
  api: deviceRegistrationApi,
  imports: [WebServicesModule],
  handlers: {
    commands: {
      cleanRemotelyRemovedProfiles: CleanRemotelyRemovedProfilesCommandHandler,
      registerDevice: RegisterDeviceCommandHandler,
    },
    events: {},
    queries: { localAccounts: LocalAccountsQueryHandler },
  },
  providers: [RegisterDeviceService],
})
export class DeviceRegistrationModule {}
