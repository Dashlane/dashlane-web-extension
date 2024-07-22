import { Result, success } from "@dashlane/framework-types";
import {
  CommandHandler,
  ICommandHandler,
} from "@dashlane/framework-application";
import { IdentityVerificationFlowContracts } from "@dashlane/authentication-contracts";
import { IdentityVerificationFlow } from "../../services/identity-verification-flow.instance.service";
@CommandHandler(IdentityVerificationFlowContracts.SubmitTotpCommand)
export class SubmitTotpCommandHandler
  implements
    ICommandHandler<IdentityVerificationFlowContracts.SubmitTotpCommand>
{
  private identityVerificationFlow: IdentityVerificationFlow;
  constructor(identityVerificationFlow: IdentityVerificationFlow) {
    this.identityVerificationFlow = identityVerificationFlow;
  }
  public execute(
    request: IdentityVerificationFlowContracts.SubmitTotpCommand
  ): Promise<Result<undefined>> {
    const { twoFactorAuthenticationOtpValue } = request.body;
    this.identityVerificationFlow.continue({
      type: "INPUT_TOTP",
      twoFactorAuthenticationOtpValue,
    });
    return Promise.resolve(success(undefined));
  }
}
