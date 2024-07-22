import { Result, success } from "@dashlane/framework-types";
import {
  CommandHandler,
  ICommandHandler,
} from "@dashlane/framework-application";
import { AuthenticationFlowContracts } from "@dashlane/authentication-contracts";
import { AuthenticationFlow } from "../../services/authentication-flow.instance.service";
@CommandHandler(AuthenticationFlowContracts.ChangeAccountEmailCommand)
export class ChangeAccountEmailCommandHandler
  implements
    ICommandHandler<AuthenticationFlowContracts.ChangeAccountEmailCommand>
{
  private authenticationFlow: AuthenticationFlow;
  constructor(authenticationFlow: AuthenticationFlow) {
    this.authenticationFlow = authenticationFlow;
  }
  public execute(
    request: AuthenticationFlowContracts.ChangeAccountEmailCommand
  ): Promise<Result<undefined>> {
    const { login } = request.body;
    this.authenticationFlow.continue({
      type: "CHANGE_ACCOUNT_EMAIL",
      login,
    });
    return Promise.resolve(success(undefined));
  }
}
