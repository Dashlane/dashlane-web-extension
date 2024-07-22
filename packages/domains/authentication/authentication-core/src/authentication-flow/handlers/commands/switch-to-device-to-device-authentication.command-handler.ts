import { Result, success } from "@dashlane/framework-types";
import {
  CommandHandler,
  ICommandHandler,
} from "@dashlane/framework-application";
import { AuthenticationFlowContracts } from "@dashlane/authentication-contracts";
import { AuthenticationFlow } from "../../services/authentication-flow.instance.service";
@CommandHandler(
  AuthenticationFlowContracts.SwitchToDevicetoDeviceAuthenticationCommand
)
export class SwitchToDevicetoDeviceAuthenticationCommandHandler
  implements
    ICommandHandler<AuthenticationFlowContracts.SwitchToDevicetoDeviceAuthenticationCommand>
{
  private authenticationFlow: AuthenticationFlow;
  constructor(authenticationFlow: AuthenticationFlow) {
    this.authenticationFlow = authenticationFlow;
  }
  public execute(): Promise<Result<undefined>> {
    this.authenticationFlow.continue({
      type: "USE_DEVICE_TO_DEVICE_AUTHENTICATION",
    });
    return Promise.resolve(success(undefined));
  }
}
