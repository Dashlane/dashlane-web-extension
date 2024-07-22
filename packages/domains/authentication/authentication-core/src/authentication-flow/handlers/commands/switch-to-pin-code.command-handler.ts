import { Result, success } from "@dashlane/framework-types";
import {
  CommandHandler,
  ICommandHandler,
} from "@dashlane/framework-application";
import { AuthenticationFlowContracts } from "@dashlane/authentication-contracts";
import { AuthenticationFlow } from "../../services/authentication-flow.instance.service";
@CommandHandler(AuthenticationFlowContracts.SwitchToPinCodeCommand)
export class SwitchToPinCodeCommandHandler
  implements
    ICommandHandler<AuthenticationFlowContracts.SwitchToPinCodeCommand>
{
  private authenticationFlow: AuthenticationFlow;
  constructor(authenticationFlow: AuthenticationFlow) {
    this.authenticationFlow = authenticationFlow;
  }
  public execute(): Promise<Result<undefined>> {
    this.authenticationFlow.continue({
      type: "SWITCH_TO_PIN_CODE",
    });
    return Promise.resolve(success(undefined));
  }
}
