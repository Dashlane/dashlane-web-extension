import { Result, success } from "@dashlane/framework-types";
import {
  CommandHandler,
  ICommandHandler,
} from "@dashlane/framework-application";
import { IdentityVerificationFlowContracts } from "@dashlane/authentication-contracts";
import { IdentityVerificationFlow } from "../../services/identity-verification-flow.instance.service";
@CommandHandler(IdentityVerificationFlowContracts.SubmitEmailTokenCommand)
export class SubmitEmailTokenCommandHandler
  implements
    ICommandHandler<IdentityVerificationFlowContracts.SubmitEmailTokenCommand>
{
  private identityVerificationFlow: IdentityVerificationFlow;
  constructor(identityVerificationFlow: IdentityVerificationFlow) {
    this.identityVerificationFlow = identityVerificationFlow;
  }
  public execute(
    request: IdentityVerificationFlowContracts.SubmitEmailTokenCommand
  ): Promise<Result<undefined>> {
    const { emailToken, deviceName } = request.body;
    this.identityVerificationFlow.continue({
      type: "INPUT_EMAIL_TOKEN",
      emailToken,
      deviceName,
    });
    return Promise.resolve(success(undefined));
  }
}
