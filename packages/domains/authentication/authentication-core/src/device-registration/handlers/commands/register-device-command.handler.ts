import {
  RegisterDeviceCommand,
  RegisterDeviceCommandErrors,
} from "@dashlane/authentication-contracts";
import {
  CommandHandler,
  CommandHandlerResponseOf,
  ICommandHandler,
} from "@dashlane/framework-application";
import {
  assertUnreachable,
  failure,
  match,
  success,
} from "@dashlane/framework-types";
import { RegisterDeviceService } from "../../services/register-device.service";
const DEVICE_AREADY_REGISTGERED: RegisterDeviceCommandErrors = {
  tag: "DeviceAlreadyRegistered",
};
@CommandHandler(RegisterDeviceCommand)
export class RegisterDeviceCommandHandler
  implements ICommandHandler<RegisterDeviceCommand>
{
  constructor(private service: RegisterDeviceService) {}
  async execute({
    body,
  }: RegisterDeviceCommand): CommandHandlerResponseOf<RegisterDeviceCommand> {
    const { login, ignoreAlreadyRegisteredError, deviceName } = body;
    if (!ignoreAlreadyRegisteredError) {
      const hasDevice = await this.service.hasRegisteredDevice(login);
      if (hasDevice) {
        return failure(DEVICE_AREADY_REGISTGERED);
      }
    }
    switch (body.with) {
      case "authTicket":
        return this.service.registerDeviceWithTicket(
          login,
          body.authTicket,
          deviceName
        );
      case "token":
        return match(
          await this.service.registerDeviceWithToken(
            login,
            body.token,
            deviceName
          ),
          {
            success: () => success(undefined),
            failure: (f) =>
              match(f.error, {
                InvalidTokenError: (e) => failure(e),
                NetworkError: (e) => failure(e),
              }),
          }
        );
      case "deviceKeys":
        return await this.service.registerDeviceWithKeys({
          deviceAccessKey: body.deviceAccessKey,
          deviceSecretKey: body.deviceSecretKey,
          login,
          settingsContent: body.settings,
          serverKey: body.serverKey,
        });
      default:
        return assertUnreachable(body);
    }
  }
}
