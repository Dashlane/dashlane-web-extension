import { CarbonQueryResult, useCarbonEndpoint, } from '@dashlane/carbon-api-consumers';
import { UserGroupView } from '@dashlane/communication';
import { carbonConnector } from 'libs/carbon/connector';
export function useUserGroup(groupId: string): CarbonQueryResult<UserGroupView | undefined> {
    return useCarbonEndpoint({
        queryConfig: {
            query: carbonConnector.getUserGroup,
            queryParam: groupId,
        },
    }, []);
}
