import { defineModuleApi } from "@dashlane/framework-contracts";
import {
  Request2FaCodesByPhoneCommand,
  ValidateWebauthnAssertionCommand,
} from "./user-verification.commands";
export const userVerificationApi = defineModuleApi({
  name: "userVerification" as const,
  commands: {
    validateWebauthnAssertion: ValidateWebauthnAssertionCommand,
    request2FaCodesByPhone: Request2FaCodesByPhoneCommand,
  },
  queries: {},
  events: {},
});
export type UserVerificationApi = typeof userVerificationApi;
