import { ExceptionLoggingModule, Module, } from '@dashlane/framework-application';
import { vaultAccessApi } from '@dashlane/session-contracts';
import { IsAllowedQueryHandler } from './handlers/queries/is-allowed.query.handler';
import { DeviceLimitQueryHandler } from './handlers/queries/device-limit.query.handler';
import { DeviceLimitChecker } from './services/device-limit-checker.service';
import { PostLoginRequirementsCheckerService } from './services/post-login-requirements-checker.service';
import { EnforceTwoFactorAuthenticationChecker } from './services/enforce-two-factor-authentication-checker.service';
import { EnforceAccountRecoveryKeyChecker } from './services/enforce-account-recovery-key-checker.service';
import { SsoMigrationChecker } from './services/sso-migration-checker.service';
import { EnforcePinChecker } from './services/enforce-pin-checker.service';
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
        DeviceLimitChecker,
        EnforceTwoFactorAuthenticationChecker,
        EnforceAccountRecoveryKeyChecker,
        EnforcePinChecker,
        SsoMigrationChecker,
    ],
    imports: [ExceptionLoggingModule],
})
export class VaultAccessModule {
}
