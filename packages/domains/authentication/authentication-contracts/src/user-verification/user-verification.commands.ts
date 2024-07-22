import { defineCommand, UseCaseScope } from "@dashlane/framework-contracts";
import { ValidateWebauthnAssertionCommandRequest } from "./webauthn-assertion-types";
import {
  Request2FaCodesByPhoneCommandParams,
  Request2FaCodesByPhoneErrors,
} from "./two-factor-authentication-types";
export class ValidateWebauthnAssertionCommand extends defineCommand<ValidateWebauthnAssertionCommandRequest>(
  {
    scope: UseCaseScope.User,
  }
) {}
export class Request2FaCodesByPhoneCommand extends defineCommand<
  Request2FaCodesByPhoneCommandParams,
  undefined,
  Request2FaCodesByPhoneErrors
>({
  scope: UseCaseScope.Device,
}) {}
