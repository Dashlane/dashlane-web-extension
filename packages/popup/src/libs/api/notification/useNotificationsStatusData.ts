import { Notifications } from '@dashlane/communication';
import { CarbonQueryResult, useCarbonEndpoint, } from '@dashlane/carbon-api-consumers';
import { carbonConnector } from 'src/carbonConnector';
export function useNotificationsStatusData(): CarbonQueryResult<Notifications> {
    return useCarbonEndpoint({
        queryConfig: {
            query: carbonConnector.getNotificationStatus,
        },
        liveConfig: {
            live: carbonConnector.liveNotificationStatus,
        },
    }, []);
}
