import { Result, success } from "@dashlane/framework-types";
import {
  CommandHandler,
  ICommandHandler,
} from "@dashlane/framework-application";
import { AuthenticationFlowContracts } from "@dashlane/authentication-contracts";
import { AuthenticationFlow } from "../../services/authentication-flow.instance.service";
@CommandHandler(AuthenticationFlowContracts.SubmitEmailTokenCommand)
export class SubmitEmailTokenCommandHandler
  implements
    ICommandHandler<AuthenticationFlowContracts.SubmitEmailTokenCommand>
{
  private authenticationFlow: AuthenticationFlow;
  constructor(authenticationFlow: AuthenticationFlow) {
    this.authenticationFlow = authenticationFlow;
  }
  public execute(
    request: AuthenticationFlowContracts.SubmitEmailTokenCommand
  ): Promise<Result<undefined>> {
    const { emailToken, deviceName } = request.body;
    this.authenticationFlow.continue({
      type: "INPUT_EMAIL_TOKEN",
      emailToken,
      deviceName,
    });
    return Promise.resolve(success(undefined));
  }
}
