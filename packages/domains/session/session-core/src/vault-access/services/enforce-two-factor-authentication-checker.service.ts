import { filter, map, Observable } from 'rxjs';
import { ExceptionLogger, Injectable } from '@dashlane/framework-application';
import { NotAllowedReason } from '@dashlane/session-contracts';
import { CarbonLegacyClient, TwoFactorAuthenticationInfoRequestStatus, } from '@dashlane/communication';
import { isSuccess } from '@dashlane/framework-types';
import { PostLoginRequirementsChecker } from './post-login-requirements.types';
@Injectable()
export class EnforceTwoFactorAuthenticationChecker implements PostLoginRequirementsChecker {
    public readonly name = 'enforce-two-factor-authentication';
    constructor(private readonly carbon: CarbonLegacyClient, private readonly exceptionLogger: ExceptionLogger) { }
    check(): Observable<NotAllowedReason[]> {
        const { liveTwoFactorAuthenticationInfo } = this.carbon.queries;
        const twoFactorAuthenticationInfo$ = liveTwoFactorAuthenticationInfo(undefined);
        return twoFactorAuthenticationInfo$.pipe(filter((twoFactorAuthenticationInfo) => {
            if (!isSuccess(twoFactorAuthenticationInfo)) {
                return true;
            }
            return (twoFactorAuthenticationInfo.data.status ===
                TwoFactorAuthenticationInfoRequestStatus.READY ||
                twoFactorAuthenticationInfo.data.status ===
                    TwoFactorAuthenticationInfoRequestStatus.ERROR);
        }), map((twoFactorAuthenticationInfo) => {
            if (!isSuccess(twoFactorAuthenticationInfo)) {
                console.log('twoFactorAuthenticationInfo query has failed');
                this.exceptionLogger.captureException({
                    message: 'twoFactorAuthenticationInfo query has failed',
                }, { useCaseName: 'isAllowedQuery' });
                return [];
            }
            const shouldEnforceTwoFactorAuthentication = twoFactorAuthenticationInfo.data.status ===
                TwoFactorAuthenticationInfoRequestStatus.READY &&
                twoFactorAuthenticationInfo.data.shouldEnforceTwoFactorAuthentication;
            if (shouldEnforceTwoFactorAuthentication) {
                return [NotAllowedReason.Requires2FAEnforcement];
            }
            return [];
        }));
    }
}
