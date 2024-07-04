import { map, Observable } from 'rxjs';
import { ExceptionLogger, Injectable } from '@dashlane/framework-application';
import { NotAllowedReason } from '@dashlane/session-contracts';
import { CarbonLegacyClient } from '@dashlane/communication';
import { isSuccess } from '@dashlane/framework-types';
import { PostLoginRequirementsChecker } from './post-login-requirements.types';
import { testIsDeviceLimited } from '../handlers/queries/carbon-device-limit';
@Injectable()
export class DeviceLimitChecker implements PostLoginRequirementsChecker {
    public readonly name = 'device-limit';
    constructor(private readonly carbon: CarbonLegacyClient, private readonly exceptionLogger: ExceptionLogger) { }
    check(): Observable<NotAllowedReason[]> {
        const { liveLoginDeviceLimitFlow } = this.carbon.queries;
        const loginDeviceLimitFlow$ = liveLoginDeviceLimitFlow(undefined);
        return loginDeviceLimitFlow$.pipe(map((deviceLimitFlow) => {
            if (!isSuccess(deviceLimitFlow)) {
                console.log('loginDeviceLimitFlow query has failed');
                this.exceptionLogger.captureException({
                    message: 'loginDeviceLimitFlow query has failed',
                }, { useCaseName: 'isAllowedQuery' });
                return [];
            }
            const isDeviceLimited = testIsDeviceLimited(deviceLimitFlow.data);
            if (isDeviceLimited) {
                return [NotAllowedReason.DeviceLimited];
            }
            return [];
        }));
    }
}
