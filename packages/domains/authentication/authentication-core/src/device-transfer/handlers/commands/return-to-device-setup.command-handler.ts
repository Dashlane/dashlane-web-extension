import {
  CommandHandler,
  type ICommandHandler,
} from "@dashlane/framework-application";
import { DeviceTransferContracts } from "@dashlane/authentication-contracts";
import { TrustedDeviceFlow } from "../../services/trusted-device-flow.instance.service";
import { Result, success } from "@dashlane/framework-types";
@CommandHandler(DeviceTransferContracts.ReturnToDeviceSetupCommand)
export class ReturnToDeviceSetupCommandHandler
  implements
    ICommandHandler<DeviceTransferContracts.ReturnToDeviceSetupCommand>
{
  constructor(private trustedDeviceFlow: TrustedDeviceFlow) {
    this.trustedDeviceFlow = trustedDeviceFlow;
  }
  public execute(): Promise<Result<undefined>> {
    this.trustedDeviceFlow.continue({
      type: "RETURN_TO_DEVICE_SETUP",
    });
    return Promise.resolve(success(undefined));
  }
}
