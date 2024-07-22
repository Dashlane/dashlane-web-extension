import { Result, success } from "@dashlane/framework-types";
import {
  CommandHandler,
  ICommandHandler,
} from "@dashlane/framework-application";
import { IdentityVerificationFlowContracts } from "@dashlane/authentication-contracts";
import { IdentityVerificationFlow } from "../../services/identity-verification-flow.instance.service";
@CommandHandler(IdentityVerificationFlowContracts.SwitchToEmailTokenCommand)
export class SwitchToEmailTokenCommandHandler
  implements
    ICommandHandler<IdentityVerificationFlowContracts.SwitchToEmailTokenCommand>
{
  private identityVerificationFlow: IdentityVerificationFlow;
  constructor(identityVerificationFlow: IdentityVerificationFlow) {
    this.identityVerificationFlow = identityVerificationFlow;
  }
  public execute(): Promise<Result<undefined>> {
    this.identityVerificationFlow.continue({
      type: "SWITCH_TO_EMAIL_TOKEN",
    });
    return Promise.resolve(success(undefined));
  }
}
