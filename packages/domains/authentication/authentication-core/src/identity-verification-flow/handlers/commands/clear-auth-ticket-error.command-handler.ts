import { Result, success } from "@dashlane/framework-types";
import {
  CommandHandler,
  ICommandHandler,
} from "@dashlane/framework-application";
import { IdentityVerificationFlowContracts } from "@dashlane/authentication-contracts";
import { IdentityVerificationFlow } from "../../services/identity-verification-flow.instance.service";
@CommandHandler(
  IdentityVerificationFlowContracts.ClearIdentityVerificationErrorCommand
)
export class ClearIdentityVerificationErrorCommandHandler
  implements
    ICommandHandler<IdentityVerificationFlowContracts.ClearIdentityVerificationErrorCommand>
{
  private identityVerificationFlow: IdentityVerificationFlow;
  constructor(identityVerificationFlow: IdentityVerificationFlow) {
    this.identityVerificationFlow = identityVerificationFlow;
  }
  public execute(): Promise<Result<undefined>> {
    this.identityVerificationFlow.continue({
      type: "CLEAR_ERROR",
    });
    return Promise.resolve(success(undefined));
  }
}
