import {
  CommandHandler,
  type ICommandHandler,
} from "@dashlane/framework-application";
import { DeviceTransferContracts } from "@dashlane/authentication-contracts";
import { TrustedDeviceFlow } from "../../services/trusted-device-flow.instance.service";
import { Result, success } from "@dashlane/framework-types";
@CommandHandler(DeviceTransferContracts.CancelRequestCommand)
export class CancelDeviceTransferRequestCommandHandler
  implements ICommandHandler<DeviceTransferContracts.CancelRequestCommand>
{
  constructor(private trustedDeviceFlow: TrustedDeviceFlow) {
    this.trustedDeviceFlow = trustedDeviceFlow;
  }
  public execute(): Promise<Result<undefined>> {
    this.trustedDeviceFlow.continue({
      type: "CANCEL_REQUEST",
    });
    return Promise.resolve(success(undefined));
  }
}
