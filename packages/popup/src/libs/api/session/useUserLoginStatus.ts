import { DataStatus, useCarbonEndpoint } from '@dashlane/carbon-api-consumers';
import { carbonConnector } from 'src/carbonConnector';
import { GetLoginStatus as UserLoginStatus } from '@dashlane/communication';
export const useUserLoginStatus = (): UserLoginStatus | undefined => {
    const result = useCarbonEndpoint({
        queryConfig: {
            query: carbonConnector.getUserLoginStatus,
        },
        liveConfig: {
            live: carbonConnector.liveLoginStatus,
        },
    }, []);
    return result.status === DataStatus.Success ? result.data : undefined;
};
