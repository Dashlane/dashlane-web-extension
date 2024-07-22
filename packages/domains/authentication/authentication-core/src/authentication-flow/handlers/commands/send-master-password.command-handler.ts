import { Result, success } from "@dashlane/framework-types";
import {
  CommandHandler,
  ICommandHandler,
} from "@dashlane/framework-application";
import { AuthenticationFlowContracts } from "@dashlane/authentication-contracts";
import { AuthenticationFlow } from "../../services/authentication-flow.instance.service";
@CommandHandler(AuthenticationFlowContracts.SendMasterPasswordCommand)
export class SendMasterPasswordCommandHandler
  implements
    ICommandHandler<AuthenticationFlowContracts.SendMasterPasswordCommand>
{
  private authenticationFlow: AuthenticationFlow;
  constructor(authenticationFlow: AuthenticationFlow) {
    this.authenticationFlow = authenticationFlow;
  }
  public execute(
    request: AuthenticationFlowContracts.SendMasterPasswordCommand
  ): Promise<Result<undefined>> {
    const { masterPassword, rememberMe } = request.body;
    this.authenticationFlow.continue({
      type: "INPUT_MASTER_PASSWORD",
      masterPassword,
      rememberMe,
    });
    return Promise.resolve(success(undefined));
  }
}
