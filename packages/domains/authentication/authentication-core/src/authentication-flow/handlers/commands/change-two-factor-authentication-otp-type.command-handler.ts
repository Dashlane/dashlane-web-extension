import { Result, success } from "@dashlane/framework-types";
import {
  CommandHandler,
  ICommandHandler,
} from "@dashlane/framework-application";
import { AuthenticationFlowContracts } from "@dashlane/authentication-contracts";
import { AuthenticationFlow } from "../../services/authentication-flow.instance.service";
@CommandHandler(
  AuthenticationFlowContracts.ChangeTwoFactorAuthenticationOtpTypeCommand
)
export class ChangeTwoFactorAuthenticationOtpTypeCommandHandler
  implements
    ICommandHandler<AuthenticationFlowContracts.ChangeTwoFactorAuthenticationOtpTypeCommand>
{
  private authenticationFlow: AuthenticationFlow;
  constructor(authenticationFlow: AuthenticationFlow) {
    this.authenticationFlow = authenticationFlow;
  }
  public execute(
    request: AuthenticationFlowContracts.ChangeTwoFactorAuthenticationOtpTypeCommand
  ): Promise<Result<undefined>> {
    const { twoFactorAuthenticationOtpType } = request.body;
    this.authenticationFlow.continue({
      type: "SWITCH_TWO_FACTOR_AUTHENTICATION_TYPE",
      twoFactorAuthenticationOtpType,
    });
    return Promise.resolve(success(undefined));
  }
}
