import { combineLatest, map, Observable } from 'rxjs';
import { ExceptionLogger, Injectable } from '@dashlane/framework-application';
import { isSuccess } from '@dashlane/framework-types';
import { NotAllowedReason } from '@dashlane/session-contracts';
import { AccountRecoveryKeyClient } from '@dashlane/account-recovery-contracts';
import { AccountAuthenticationType, CarbonLegacyClient, } from '@dashlane/communication';
import { PostLoginRequirementsChecker } from './post-login-requirements.types';
const ENFORCE_ARK_FOR: Record<AccountAuthenticationType, boolean> = {
    masterPassword: false,
    invisibleMasterPassword: true,
};
@Injectable()
export class EnforceAccountRecoveryKeyChecker implements PostLoginRequirementsChecker {
    public readonly name = 'enforce-ark';
    constructor(private readonly carbon: CarbonLegacyClient, private readonly ark: AccountRecoveryKeyClient, private readonly exceptionLogger: ExceptionLogger) { }
    check(login?: string): Observable<NotAllowedReason[]> {
        if (!login) {
            throw new Error('No user login provided');
        }
        const { getAccountAuthenticationType } = this.carbon.queries;
        const accountAuthenticationType$ = getAccountAuthenticationType();
        const accountRecoveryKeyStatus$ = this.ark.queries.accountRecoveryKeyStatus({ login });
        return combineLatest({
            accountAuthenticationType: accountAuthenticationType$,
            accountRecoveryKeyStatus: accountRecoveryKeyStatus$,
        }).pipe(map(({ accountAuthenticationType, accountRecoveryKeyStatus }) => {
            if (!isSuccess(accountAuthenticationType) ||
                !isSuccess(accountRecoveryKeyStatus)) {
                console.log('One of these queries has failed: [accountAuthenticationType, accountRecoveryKeyStatus]');
                this.exceptionLogger.captureException({
                    message: 'One of these queries has failed: [accountAuthenticationType, accountRecoveryKeyStatus]',
                }, { useCaseName: 'isAllowedQuery' });
                return [];
            }
            const shouldEnforceAccountRecoveryKey = ENFORCE_ARK_FOR[accountAuthenticationType.data] &&
                !accountRecoveryKeyStatus.data.isEnabled;
            if (shouldEnforceAccountRecoveryKey) {
                return [NotAllowedReason.RequiresSettingUpRecoveryKey];
            }
            return [];
        }));
    }
}
