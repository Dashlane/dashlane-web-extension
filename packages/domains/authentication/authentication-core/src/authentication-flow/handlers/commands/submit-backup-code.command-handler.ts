import { Result, success } from "@dashlane/framework-types";
import {
  CommandHandler,
  ICommandHandler,
} from "@dashlane/framework-application";
import { AuthenticationFlowContracts } from "@dashlane/authentication-contracts";
import { AuthenticationFlow } from "../../services/authentication-flow.instance.service";
@CommandHandler(AuthenticationFlowContracts.SubmitBackupCodeCommand)
export class SubmitBackupCodeCommandHandler
  implements
    ICommandHandler<AuthenticationFlowContracts.SubmitBackupCodeCommand>
{
  private authenticationFlow: AuthenticationFlow;
  constructor(authenticationFlow: AuthenticationFlow) {
    this.authenticationFlow = authenticationFlow;
  }
  public execute(
    request: AuthenticationFlowContracts.SubmitBackupCodeCommand
  ): Promise<Result<undefined>> {
    const { twoFactorAuthenticationOtpValue } = request.body;
    this.authenticationFlow.continue({
      type: "INPUT_BACKUP_CODE",
      twoFactorAuthenticationOtpValue,
    });
    return Promise.resolve(success(undefined));
  }
}
