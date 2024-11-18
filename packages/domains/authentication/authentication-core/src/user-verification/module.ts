import { userVerificationApi } from "@dashlane/authentication-contracts";
import { Module } from "@dashlane/framework-application";
import { WebServicesModule } from "@dashlane/framework-dashlane-application";
import { AuthenticationModule } from "../authentication";
import { ValidateWebauthnAssertionCommandHandler } from "./handlers/commands/validate-webauthn-assertion-handler";
import { Request2FaCodesByPhoneCommandHandler } from "./handlers/commands/request-two-factor-codes-by-phone.command.handler";
import { UserVerificationMethodsQueryHandler } from "./handlers/commands/user-verification-methods.query.handler";
import { RememberMeSessionKeysRepository } from "../remember-me/remember-me-session-keys.repository";
@Module({
  api: userVerificationApi,
  handlers: {
    commands: {
      validateWebauthnAssertion: ValidateWebauthnAssertionCommandHandler,
      request2FaCodesByPhone: Request2FaCodesByPhoneCommandHandler,
    },
    events: {},
    queries: {
      userVerificationMethods: UserVerificationMethodsQueryHandler,
    },
  },
  imports: [WebServicesModule, AuthenticationModule],
  providers: [RememberMeSessionKeysRepository],
})
export class UserVerificationModule {}
