import {
  ExceptionLoggingModule,
  Module,
} from "@dashlane/framework-application";
import { vaultAccessApi } from "@dashlane/session-contracts";
import { IsAllowedQueryHandler } from "./handlers/queries/is-allowed.query.handler";
import { DeviceLimitQueryHandler } from "./handlers/queries/device-limit.query.handler";
import {
  ChangeLoginEmailChecker,
  DeviceLimitChecker,
  EnforceAccountRecoveryKeyChecker,
  EnforcePinChecker,
  EnforceTwoFactorAuthenticationChecker,
  PostLoginRequirementsCheckerService,
  SsoMigrationChecker,
} from "./services";
@Module({
  api: vaultAccessApi,
  handlers: {
    commands: {},
    events: {},
    queries: {
      isAllowed: IsAllowedQueryHandler,
      deviceLimit: DeviceLimitQueryHandler,
    },
  },
  providers: [
    DeviceLimitChecker,
    PostLoginRequirementsCheckerService,
    EnforceTwoFactorAuthenticationChecker,
    EnforceAccountRecoveryKeyChecker,
    EnforcePinChecker,
    SsoMigrationChecker,
    ChangeLoginEmailChecker,
  ],
  imports: [ExceptionLoggingModule],
})
export class VaultAccessModule {}
