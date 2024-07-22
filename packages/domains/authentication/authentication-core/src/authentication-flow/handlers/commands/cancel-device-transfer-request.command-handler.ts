import { Result, success } from "@dashlane/framework-types";
import {
  CommandHandler,
  ICommandHandler,
} from "@dashlane/framework-application";
import { AuthenticationFlowContracts } from "@dashlane/authentication-contracts";
import { AuthenticationFlow } from "../../services/authentication-flow.instance.service";
@CommandHandler(AuthenticationFlowContracts.CancelDeviceTransferRequestCommand)
export class CancelDeviceTransferRequestCommandHandler
  implements
    ICommandHandler<AuthenticationFlowContracts.CancelDeviceTransferRequestCommand>
{
  private authenticationFlow: AuthenticationFlow;
  constructor(authenticationFlow: AuthenticationFlow) {
    this.authenticationFlow = authenticationFlow;
  }
  public execute(): Promise<Result<undefined>> {
    this.authenticationFlow.continue({
      type: "CANCEL_DEVICE_TRANSFER_REQUEST",
    });
    return Promise.resolve(success(undefined));
  }
}
