import { defineModuleApi } from "@dashlane/framework-contracts";
import {
  Request2FaCodesByPhoneCommand,
  ValidateWebauthnAssertionCommand,
} from "./user-verification.commands";
import { UserVerificationMethodsQuery } from "./user-verification-methods.query";
export const userVerificationApi = defineModuleApi({
  name: "userVerification" as const,
  commands: {
    validateWebauthnAssertion: ValidateWebauthnAssertionCommand,
    request2FaCodesByPhone: Request2FaCodesByPhoneCommand,
  },
  queries: {
    userVerificationMethods: UserVerificationMethodsQuery,
  },
  events: {},
});
export type UserVerificationApi = typeof userVerificationApi;
