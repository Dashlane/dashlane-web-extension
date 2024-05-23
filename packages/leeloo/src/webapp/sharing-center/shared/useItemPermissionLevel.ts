import { CarbonQueryResult, useCarbonEndpoint, } from '@dashlane/carbon-api-consumers';
import { GroupRecipient, MemberPermission, UserRecipient, } from '@dashlane/communication';
import { carbonConnector } from 'libs/carbon/connector';
import { isUserGroup } from 'webapp/sharing-center/shared/items-list/util';
export function useItemPermissionLevel(itemId: string, entity: UserRecipient | GroupRecipient): CarbonQueryResult<MemberPermission | undefined> {
    let endpointConfig;
    let queryParam;
    if (isUserGroup(entity)) {
        queryParam = {
            itemId,
            groupId: entity.groupId,
        };
        endpointConfig = {
            queryConfig: {
                query: carbonConnector.getUserGroupPermissionLevel,
                queryParam,
            },
            liveConfig: {
                live: carbonConnector.liveUserGroupPermissionLevel,
                liveParam: btoa(JSON.stringify(queryParam)),
            },
        };
    }
    else {
        queryParam = {
            itemId,
            userId: entity.alias,
        };
        endpointConfig = {
            queryConfig: {
                query: carbonConnector.getSharingUserPermissionLevel,
                queryParam,
            },
            liveConfig: {
                live: carbonConnector.liveSharingUserPermissionLevel,
                liveParam: btoa(JSON.stringify(queryParam)),
            },
        };
    }
    return useCarbonEndpoint(endpointConfig, []);
}
