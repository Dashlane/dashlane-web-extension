import { DataStatus, useCarbonEndpoint } from '@dashlane/carbon-api-consumers';
import { UserMessage } from '@dashlane/communication';
import { carbonConnector } from 'src/carbonConnector';
export function useUserMessages(): UserMessage[] {
    const result = useCarbonEndpoint({
        queryConfig: {
            query: carbonConnector.getUserMessages,
        },
        liveConfig: {
            live: carbonConnector.liveUserMessages,
        },
    }, []);
    return result.status === DataStatus.Success ? result.data : [];
}
