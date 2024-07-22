import { Result, success } from "@dashlane/framework-types";
import {
  CommandHandler,
  ICommandHandler,
} from "@dashlane/framework-application";
import { AuthenticationFlowContracts } from "@dashlane/authentication-contracts";
import { AuthenticationFlow } from "../../services/authentication-flow.instance.service";
@CommandHandler(AuthenticationFlowContracts.SubmitTotpCommand)
export class SubmitTotpCommandHandler
  implements ICommandHandler<AuthenticationFlowContracts.SubmitTotpCommand>
{
  private authenticationFlow: AuthenticationFlow;
  constructor(authenticationFlow: AuthenticationFlow) {
    this.authenticationFlow = authenticationFlow;
  }
  public execute(
    request: AuthenticationFlowContracts.SubmitTotpCommand
  ): Promise<Result<undefined>> {
    const { twoFactorAuthenticationOtpValue } = request.body;
    this.authenticationFlow.continue({
      type: "INPUT_TOTP",
      twoFactorAuthenticationOtpValue,
    });
    return Promise.resolve(success(undefined));
  }
}
