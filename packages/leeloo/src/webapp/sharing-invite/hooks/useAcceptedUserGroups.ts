import { DataStatus, useCarbonEndpoint } from '@dashlane/carbon-api-consumers';
import { UserGroupDownload } from '@dashlane/communication';
import { carbonConnector } from 'libs/carbon/connector';
export const useAcceptedUserGroups = (): UserGroupDownload[] => {
    const result = useCarbonEndpoint({
        queryConfig: {
            query: carbonConnector.getMyAcceptedUserGroups,
        },
        liveConfig: {
            live: carbonConnector.liveMyAcceptedUserGroups,
        },
    }, []);
    return result.status === DataStatus.Success ? result.data : [];
};
