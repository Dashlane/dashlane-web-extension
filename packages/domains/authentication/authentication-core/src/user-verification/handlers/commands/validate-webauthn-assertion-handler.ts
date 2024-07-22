import { ValidateWebauthnAssertionCommand } from "@dashlane/authentication-contracts";
import {
  CommandHandler,
  ICommandHandler,
} from "@dashlane/framework-application";
import { ContextlessServerApiClient } from "@dashlane/framework-dashlane-application";
import {
  getSuccess,
  isFailure,
  isSuccess,
  Result,
  success,
} from "@dashlane/framework-types";
import { SessionClient } from "@dashlane/session-contracts";
import { firstValueFrom } from "rxjs";
import { AuthenticationWebServicesRepository } from "../../../authentication";
@CommandHandler(ValidateWebauthnAssertionCommand)
export class ValidateWebauthnAssertionCommandHandler
  implements ICommandHandler<ValidateWebauthnAssertionCommand>
{
  constructor(
    private contextLessServerApiClient: ContextlessServerApiClient,
    private authWSRepository: AuthenticationWebServicesRepository,
    private sessionClient: SessionClient
  ) {}
  public async execute(
    request: ValidateWebauthnAssertionCommand
  ): Promise<Result<undefined>> {
    const currentUserLogin = await firstValueFrom(
      this.sessionClient.queries.selectedOpenedSession()
    );
    const login = isSuccess(currentUserLogin)
      ? getSuccess(currentUserLogin)
      : request.body.login;
    if (login === undefined) {
      throw new Error("Logged out and no login specified");
    }
    const { id, type, rawId, response } = request.body.assertion;
    const result = await firstValueFrom(
      this.contextLessServerApiClient.v1.authentication.completeRememberMeOpenSession(
        await this.authWSRepository.getSessionCredentialsForUser(login),
        {
          authenticator: {
            authenticationType: "webauthn.get",
            credential: { type, id, rawId, response },
          },
        }
      )
    );
    if (isFailure(result)) {
      throw new Error(`Assertion could not be validated: ${result.error.name}`);
    }
    return success(undefined);
  }
}
