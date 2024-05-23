import { useCarbonEndpoint } from '@dashlane/carbon-api-consumers';
import { DataStatus } from '@dashlane/framework-react';
import { carbonConnector } from 'libs/carbon/connector';
export interface UseHasSharedGroupWithMembers {
    status: DataStatus;
    hasSharedGroupWithMembers?: boolean;
}
export const useHasSharedGroupWithMembers = (): UseHasSharedGroupWithMembers => {
    const result = useCarbonEndpoint({
        queryConfig: {
            query: carbonConnector.getAdministrableUserGroups,
        },
        liveConfig: {
            live: carbonConnector.liveAdministrableUserGroups,
        },
    }, []);
    if (result.status !== DataStatus.Success) {
        return result;
    }
    return {
        status: DataStatus.Success,
        hasSharedGroupWithMembers: !!result.data.find((group) => group.users.length > 0),
    };
};
