import { defineModuleApi } from "@dashlane/framework-contracts";
import {
  ActivateCommand,
  DeactivateCommand,
  LoginWithPinCodeCommand,
} from "./commands";
import { GetCurrentUserStatusQuery, GetStatusQuery } from "./queries";
export const pinCodeApi = defineModuleApi({
  name: "pinCode" as const,
  commands: {
    activate: ActivateCommand,
    deactivate: DeactivateCommand,
    loginWithPinCode: LoginWithPinCodeCommand,
  },
  events: {},
  queries: {
    getStatus: GetStatusQuery,
    getCurrentUserStatus: GetCurrentUserStatusQuery,
  },
});
export type PinCodeApi = typeof pinCodeApi;
