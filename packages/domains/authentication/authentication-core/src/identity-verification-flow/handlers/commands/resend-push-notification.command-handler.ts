import { Result, success } from "@dashlane/framework-types";
import {
  CommandHandler,
  ICommandHandler,
} from "@dashlane/framework-application";
import { IdentityVerificationFlowContracts } from "@dashlane/authentication-contracts";
import { IdentityVerificationFlow } from "../../services/identity-verification-flow.instance.service";
@CommandHandler(IdentityVerificationFlowContracts.ResendPushNotificationCommand)
export class ResendPushNotificationCommandHandler
  implements
    ICommandHandler<IdentityVerificationFlowContracts.ResendPushNotificationCommand>
{
  private identityVerificationFlow: IdentityVerificationFlow;
  constructor(identityVerificationFlow: IdentityVerificationFlow) {
    this.identityVerificationFlow = identityVerificationFlow;
  }
  public execute(): Promise<Result<undefined>> {
    this.identityVerificationFlow.continue({
      type: "RESEND_PUSH_NOTIFICATION",
    });
    return Promise.resolve(success(undefined));
  }
}
