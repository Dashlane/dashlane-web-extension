import { defineModuleApi } from "@dashlane/framework-contracts";
import {
  ActivateCommand,
  DeactivateCommand,
  LoginWithPinCodeCommand,
} from "./commands";
import {
  GetCurrentUserStatusQuery,
  GetStatusQuery,
  IsPinCodeCorrectQuery,
} from "./queries";
export const pinCodeApi = defineModuleApi({
  name: "pinCode" as const,
  commands: {
    activate: ActivateCommand,
    deactivate: DeactivateCommand,
    loginWithPinCode: LoginWithPinCodeCommand,
  },
  events: {},
  queries: {
    isPinCodeCorrect: IsPinCodeCorrectQuery,
    getStatus: GetStatusQuery,
    getCurrentUserStatus: GetCurrentUserStatusQuery,
  },
});
export type PinCodeApi = typeof pinCodeApi;
