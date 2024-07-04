import { firstValueFrom } from 'rxjs';
import { CarbonLegacyClient } from '@dashlane/communication';
import { ICronTaskHandler, Injectable } from '@dashlane/framework-application';
import { isSuccess } from '@dashlane/framework-types';
import { SessionConfig } from '../../infra';
@Injectable()
export class CloseSessionOnIdleCronHandler implements ICronTaskHandler {
    constructor(private carbonLegacyClient: CarbonLegacyClient, private readonly conf: SessionConfig) { }
    public async run() {
        await this.carbonLegacyClient.commands.carbonLegacyLeeloo({
            name: 'closeSession',
            arg: [{}],
        });
    }
    public async isRunnable() {
        const getPremiumStatusQuery = await firstValueFrom(this.carbonLegacyClient.queries.getPremiumStatus());
        if (!isSuccess(getPremiumStatusQuery) ||
            !getPremiumStatusQuery.data.spaces) {
            return false;
        }
        const activeSpace = getPremiumStatusQuery.data.spaces.find((space) => space.status === 'accepted');
        const intervalInMinutes = activeSpace?.info.forceAutomaticLogout;
        if (!intervalInMinutes) {
            return false;
        }
        const isIdle = await this.conf.isUserIdle(intervalInMinutes * 60);
        return isIdle;
    }
}
