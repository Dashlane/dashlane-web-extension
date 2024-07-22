import { Result, success } from "@dashlane/framework-types";
import {
  CommandHandler,
  ICommandHandler,
} from "@dashlane/framework-application";
import { AuthenticationFlowContracts } from "@dashlane/authentication-contracts";
import { AuthenticationFlow } from "../../services/authentication-flow.instance.service";
@CommandHandler(AuthenticationFlowContracts.SubmitPinCodeCommand)
export class SubmitPinCodeCommandHandler
  implements ICommandHandler<AuthenticationFlowContracts.SubmitPinCodeCommand>
{
  private authenticationFlow: AuthenticationFlow;
  constructor(authenticationFlow: AuthenticationFlow) {
    this.authenticationFlow = authenticationFlow;
  }
  public execute(
    request: AuthenticationFlowContracts.SubmitPinCodeCommand
  ): Promise<Result<undefined>> {
    const { pinCode } = request.body;
    this.authenticationFlow.continue({
      type: "INPUT_PIN_CODE",
      pinCode,
    });
    return Promise.resolve(success(undefined));
  }
}
