import { Result, success } from "@dashlane/framework-types";
import {
  CommandHandler,
  ICommandHandler,
} from "@dashlane/framework-application";
import { IdentityVerificationFlowContracts } from "@dashlane/authentication-contracts";
import { IdentityVerificationFlow } from "../../services/identity-verification-flow.instance.service";
@CommandHandler(
  IdentityVerificationFlowContracts.StartIdentityVerificationCommand
)
export class StartIdentityVerificationCommandHandler
  implements
    ICommandHandler<IdentityVerificationFlowContracts.StartIdentityVerificationCommand>
{
  private identityVerificationFlow: IdentityVerificationFlow;
  constructor(identityVerificationFlow: IdentityVerificationFlow) {
    this.identityVerificationFlow = identityVerificationFlow;
  }
  public execute(
    request: IdentityVerificationFlowContracts.StartIdentityVerificationCommand
  ): Promise<Result<undefined>> {
    const { login, verificationMethod } = request.body;
    switch (verificationMethod) {
      case "email_token":
        this.identityVerificationFlow.continue({
          type: "VERIFY_IDENTITY_WITH_TOKEN",
          login,
        });
        break;
      case "totp":
        this.identityVerificationFlow.continue({
          type: "VERIFY_IDENTITY_WITH_TOTP",
          login,
        });
        break;
      case "dashlane_authenticator":
        this.identityVerificationFlow.continue({
          type: "VERIFY_IDENTITY_WITH_DASHLANE_AUTHENTICATOR",
          login,
        });
        break;
      default:
        break;
    }
    return Promise.resolve(success(undefined));
  }
}
