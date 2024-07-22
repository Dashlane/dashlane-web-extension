import { Result, success } from "@dashlane/framework-types";
import {
  CommandHandler,
  ICommandHandler,
} from "@dashlane/framework-application";
import { AuthenticationFlowContracts } from "@dashlane/authentication-contracts";
import { AuthenticationFlow } from "../../services/authentication-flow.instance.service";
@CommandHandler(AuthenticationFlowContracts.ResendEmailTokenCommand)
export class ResendEmailTokenCommandHandler
  implements
    ICommandHandler<AuthenticationFlowContracts.ResendEmailTokenCommand>
{
  private authenticationFlow: AuthenticationFlow;
  constructor(authenticationFlow: AuthenticationFlow) {
    this.authenticationFlow = authenticationFlow;
  }
  public execute(): Promise<Result<undefined>> {
    this.authenticationFlow.continue({
      type: "RESEND_EMAIL_TOKEN",
    });
    return Promise.resolve(success(undefined));
  }
}
