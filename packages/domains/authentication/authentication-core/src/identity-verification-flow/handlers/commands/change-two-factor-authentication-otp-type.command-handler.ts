import { Result, success } from "@dashlane/framework-types";
import {
  CommandHandler,
  ICommandHandler,
} from "@dashlane/framework-application";
import { IdentityVerificationFlowContracts } from "@dashlane/authentication-contracts";
import { IdentityVerificationFlow } from "../../services/identity-verification-flow.instance.service";
@CommandHandler(
  IdentityVerificationFlowContracts.ChangeTwoFactorAuthenticationOtpTypeCommand
)
export class ChangeTwoFactorAuthenticationOtpTypeCommandHandler
  implements
    ICommandHandler<IdentityVerificationFlowContracts.ChangeTwoFactorAuthenticationOtpTypeCommand>
{
  private identityVerificationFlow: IdentityVerificationFlow;
  constructor(identityVerificationFlow: IdentityVerificationFlow) {
    this.identityVerificationFlow = identityVerificationFlow;
  }
  public execute(
    request: IdentityVerificationFlowContracts.ChangeTwoFactorAuthenticationOtpTypeCommand
  ): Promise<Result<undefined>> {
    const { twoFactorAuthenticationOtpType } = request.body;
    this.identityVerificationFlow.continue({
      type: "SWITCH_TWO_FACTOR_AUTHENTICATION_TYPE",
      twoFactorAuthenticationOtpType,
    });
    return Promise.resolve(success(undefined));
  }
}
