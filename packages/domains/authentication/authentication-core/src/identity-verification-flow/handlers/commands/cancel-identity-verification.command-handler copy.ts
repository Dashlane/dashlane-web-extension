import { Result, success } from "@dashlane/framework-types";
import {
  CommandHandler,
  ICommandHandler,
} from "@dashlane/framework-application";
import { IdentityVerificationFlowContracts } from "@dashlane/authentication-contracts";
import { IdentityVerificationFlow } from "../../services/identity-verification-flow.instance.service";
@CommandHandler(
  IdentityVerificationFlowContracts.CancelIdentityVerificationCommand
)
export class CancelIdentityVerificationCommandHandler
  implements
    ICommandHandler<IdentityVerificationFlowContracts.CancelIdentityVerificationCommand>
{
  private identityVerificationFlow: IdentityVerificationFlow;
  constructor(identityVerificationFlow: IdentityVerificationFlow) {
    this.identityVerificationFlow = identityVerificationFlow;
  }
  public execute(): Promise<Result<undefined>> {
    this.identityVerificationFlow.continue({
      type: "CANCEL_IDENTITY_VERIFICATION",
    });
    return Promise.resolve(success(undefined));
  }
}
