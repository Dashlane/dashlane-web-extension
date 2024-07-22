import { firstValueFrom } from "rxjs";
import {
  CommandHandler,
  CommandHandlerResponseOf,
  ICommandHandler,
} from "@dashlane/framework-application";
import {
  PanicOnNetworkError,
  ServerApiClient,
} from "@dashlane/framework-dashlane-application";
import {
  failure,
  match,
  matchMap,
  panic,
  success,
} from "@dashlane/framework-types";
import {
  Request2FaCodesByPhoneCommand,
  Request2FaCodesByPhoneErrorCodes,
} from "@dashlane/authentication-contracts";
function makeFailure<X extends Request2FaCodesByPhoneErrorCodes>(error: X) {
  return () => failure({ tag: error });
}
@CommandHandler(Request2FaCodesByPhoneCommand)
export class Request2FaCodesByPhoneCommandHandler
  implements ICommandHandler<Request2FaCodesByPhoneCommand>
{
  constructor(private server: ServerApiClient) {}
  async execute({
    body: { email },
  }: Request2FaCodesByPhoneCommand): CommandHandlerResponseOf<Request2FaCodesByPhoneCommand> {
    const result = await firstValueFrom(
      this.server.v1.authentication.requestOtpRecoveryCodesByPhone({
        login: email,
      })
    );
    return match(result, {
      success: () => success(undefined),
      failure: (error) =>
        match(error.error, {
          ...PanicOnNetworkError,
          FetchFailedError: makeFailure(
            Request2FaCodesByPhoneErrorCodes.NetworkError
          ),
          BusinessError: (b) =>
            matchMap(b.code, {
              INVALID_RECOVERY_PHONE: makeFailure(
                Request2FaCodesByPhoneErrorCodes.AccountNotEligible
              ),
              SMS_ERROR: () => panic("Dashlane servers failed to send SMS"),
              SMS_OPT_OUT: makeFailure(
                Request2FaCodesByPhoneErrorCodes.AccountNotEligible
              ),
              USER_NOT_FOUND: makeFailure(
                Request2FaCodesByPhoneErrorCodes.AccountNotEligible
              ),
              WRONG_OTP_STATUS: makeFailure(
                Request2FaCodesByPhoneErrorCodes.AccountNotEligible
              ),
            }),
        }),
    });
  }
}
