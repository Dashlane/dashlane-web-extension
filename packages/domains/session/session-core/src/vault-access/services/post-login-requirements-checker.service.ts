import { combineLatest, distinctUntilChanged, map, Observable, of, switchMap, timeout, } from 'rxjs';
import { ExceptionLogger, Injectable } from '@dashlane/framework-application';
import { NotAllowedReason, SessionClient, UserIsAllowed, UserIsNotAllowed, } from '@dashlane/session-contracts';
import { isSuccess } from '@dashlane/framework-types';
import { PostLoginRequirementsChecker } from './post-login-requirements.types';
import { DeviceLimitChecker } from './device-limit-checker.service';
import { EnforceAccountRecoveryKeyChecker } from './enforce-account-recovery-key-checker.service';
import { EnforcePinChecker } from './enforce-pin-checker.service';
import { EnforceTwoFactorAuthenticationChecker } from './enforce-two-factor-authentication-checker.service';
import { SsoMigrationChecker } from './sso-migration-checker.service';
const userAllowed = { isAllowed: true } as const;
@Injectable()
export class PostLoginRequirementsCheckerService {
    private readonly postLoginRequirements: PostLoginRequirementsChecker[];
    constructor(private readonly session: SessionClient, private readonly exceptionLogger: ExceptionLogger, deviceLimitChecker: DeviceLimitChecker, enforceAccountRecoveryKeyChecker: EnforceAccountRecoveryKeyChecker, enforcePinChecker: EnforcePinChecker, enforceTwoFactorAuthenticationChecker: EnforceTwoFactorAuthenticationChecker, ssoMigrationChecker: SsoMigrationChecker) {
        this.postLoginRequirements = [
            deviceLimitChecker,
            enforceAccountRecoveryKeyChecker,
            enforcePinChecker,
            enforceTwoFactorAuthenticationChecker,
            ssoMigrationChecker,
        ];
    }
    execute(): Observable<UserIsAllowed | UserIsNotAllowed> {
        const { selectedOpenedSession } = this.session.queries;
        const activeLogin$ = selectedOpenedSession(undefined);
        return activeLogin$.pipe(switchMap((activeLogin) => {
            if (!isSuccess(activeLogin)) {
                throw new Error("Failed to get active user's login");
            }
            if (!activeLogin.data) {
                return of({
                    isAllowed: false,
                    reasons: [NotAllowedReason.NoActiveUser],
                } satisfies UserIsNotAllowed);
            }
            const postLoginRequirements$ = this.postLoginRequirements.map((postLoginRequirement) => postLoginRequirement.check(activeLogin.data).pipe(timeout({
                first: 3000,
                with: () => {
                    console.log(`${postLoginRequirement.name} query has timed out`);
                    this.exceptionLogger.captureException({
                        message: `${postLoginRequirement.name} query has timed out`,
                    }, { useCaseName: 'isAllowedQuery' });
                    return [];
                },
            })));
            return combineLatest(postLoginRequirements$).pipe(map((requirementsResults) => {
                const requiredActions = requirementsResults.flat();
                if (requiredActions.length > 0) {
                    return {
                        isAllowed: false,
                        reasons: requiredActions,
                    } as UserIsNotAllowed;
                }
                return userAllowed;
            }), distinctUntilChanged());
        }));
    }
}
