import { defineModuleApi } from "@dashlane/framework-contracts";
import {
  CanUserAddNewPasswordQuery,
  GetPasswordLimitStatusQuery,
  IsFreeUserFrozenQuery,
} from "./queries";
export const passwordLimitApi = defineModuleApi({
  name: "passwordLimit" as const,
  commands: {},
  events: {},
  queries: {
    canUserAddNewPassword: CanUserAddNewPasswordQuery,
    getPasswordLimitStatus: GetPasswordLimitStatusQuery,
    isFreeUserFrozen: IsFreeUserFrozenQuery,
  },
});
