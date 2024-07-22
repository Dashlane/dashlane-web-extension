import { Module } from "@dashlane/framework-application";
import {
  PASSWORD_LIMIT_FEATURE_FLIPS,
  passwordLimitApi,
} from "@dashlane/vault-contracts";
import { VaultRepository } from "../vault-repository";
import { CanUserAddNewPasswordQueryHandler } from "./handlers/can-user-add-new-password.query.handler";
import { GetPasswordLimitStatusQueryHandler } from "./handlers/get-password-limit-status.query.handler";
import { IsFreeUserFrozenQueryHandler } from "./handlers/is-free-user-frozen.query.handler";
import { PasswordLimitRepository } from "./password-limit-repository";
@Module({
  api: passwordLimitApi,
  stores: [],
  handlers: {
    commands: {},
    events: {},
    queries: {
      canUserAddNewPassword: CanUserAddNewPasswordQueryHandler,
      getPasswordLimitStatus: GetPasswordLimitStatusQueryHandler,
      isFreeUserFrozen: IsFreeUserFrozenQueryHandler,
    },
  },
  providers: [VaultRepository, PasswordLimitRepository],
  requiredFeatureFlips: [...Object.values(PASSWORD_LIMIT_FEATURE_FLIPS)],
})
export class PasswordLimitModule {}
