import { Result, success } from "@dashlane/framework-types";
import {
  CommandHandler,
  ICommandHandler,
} from "@dashlane/framework-application";
import { AuthenticationFlowContracts } from "@dashlane/authentication-contracts";
import { AuthenticationFlow } from "../../services/authentication-flow.instance.service";
@CommandHandler(AuthenticationFlowContracts.WebAuthnAuthenticationFailCommand)
export class WebAuthnAuthenticationFailCommandHandler
  implements
    ICommandHandler<AuthenticationFlowContracts.WebAuthnAuthenticationFailCommand>
{
  private authenticationFlow: AuthenticationFlow;
  constructor(authenticationFlow: AuthenticationFlow) {
    this.authenticationFlow = authenticationFlow;
  }
  public execute(
    request: AuthenticationFlowContracts.WebAuthnAuthenticationFailCommand
  ): Promise<Result<undefined>> {
    const { webAuthnError } = request.body;
    this.authenticationFlow.continue({
      type: "WEBAUTHN_AUTHENTICATION_FAIL",
      error: webAuthnError,
    });
    return Promise.resolve(success(undefined));
  }
}
