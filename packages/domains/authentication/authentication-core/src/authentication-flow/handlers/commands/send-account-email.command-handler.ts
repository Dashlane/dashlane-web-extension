import { Result, success } from "@dashlane/framework-types";
import {
  CommandHandler,
  ICommandHandler,
} from "@dashlane/framework-application";
import { AuthenticationFlowContracts } from "@dashlane/authentication-contracts";
import { AuthenticationFlow } from "../../services/authentication-flow.instance.service";
@CommandHandler(AuthenticationFlowContracts.SendAccountEmailCommand)
export class SendAccountEmailCommandHandler
  implements
    ICommandHandler<AuthenticationFlowContracts.SendAccountEmailCommand>
{
  private authenticationFlow: AuthenticationFlow;
  constructor(authenticationFlow: AuthenticationFlow) {
    this.authenticationFlow = authenticationFlow;
  }
  public execute(
    request: AuthenticationFlowContracts.SendAccountEmailCommand
  ): Promise<Result<undefined>> {
    const { login } = request.body;
    this.authenticationFlow.continue({
      type: "INPUT_ACCOUNT_EMAIL",
      login,
    });
    return Promise.resolve(success(undefined));
  }
}
