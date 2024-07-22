import { Result, success } from "@dashlane/framework-types";
import {
  CommandHandler,
  ICommandHandler,
} from "@dashlane/framework-application";
import { AuthenticationFlowContracts } from "@dashlane/authentication-contracts";
import { AuthenticationFlow } from "../../services/authentication-flow.instance.service";
@CommandHandler(AuthenticationFlowContracts.SwitchToMasterPasswordCommand)
export class SwitchToMasterPasswordCommandHandler
  implements
    ICommandHandler<AuthenticationFlowContracts.SwitchToMasterPasswordCommand>
{
  private authenticationFlow: AuthenticationFlow;
  constructor(authenticationFlow: AuthenticationFlow) {
    this.authenticationFlow = authenticationFlow;
  }
  public execute(): Promise<Result<undefined>> {
    this.authenticationFlow.continue({
      type: "USE_MASTER_PASSWORD",
    });
    return Promise.resolve(success(undefined));
  }
}
