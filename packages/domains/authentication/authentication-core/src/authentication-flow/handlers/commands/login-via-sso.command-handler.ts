import { Result, success } from "@dashlane/framework-types";
import {
  CommandHandler,
  ICommandHandler,
} from "@dashlane/framework-application";
import { AuthenticationFlowContracts } from "@dashlane/authentication-contracts";
import { AuthenticationFlow } from "../../services/authentication-flow.instance.service";
@CommandHandler(AuthenticationFlowContracts.LoginViaSSOCommand)
export class LoginViaSSOCommandHandler
  implements ICommandHandler<AuthenticationFlowContracts.LoginViaSSOCommand>
{
  private authenticationFlow: AuthenticationFlow;
  constructor(authenticationFlow: AuthenticationFlow) {
    this.authenticationFlow = authenticationFlow;
  }
  public execute(
    request: AuthenticationFlowContracts.LoginViaSSOCommand
  ): Promise<Result<undefined>> {
    this.authenticationFlow.continue({
      type: "CARBON_LEGACY_SSO_LOGIN_BYPASS",
      ...request.body,
    });
    return Promise.resolve(success(undefined));
  }
}
