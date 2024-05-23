import { CarbonQueryResult, useCarbonEndpoint, } from '@dashlane/carbon-api-consumers';
import { FilterCriterium, GetUserGroupMembersRequest, ListResults, SortDirection, UserGroupMembersFilterField, UserGroupMemberView, } from '@dashlane/communication';
import { carbonConnector } from 'libs/carbon/connector';
export function useUserGroupMembers(groupId: string, searchValue: string, sortDirection: SortDirection = 'ascend'): CarbonQueryResult<ListResults<UserGroupMemberView>> {
    const filterCriteria: FilterCriterium<UserGroupMembersFilterField>[] = [];
    if (searchValue !== '') {
        filterCriteria.push({
            type: 'matches',
            value: searchValue,
        });
    }
    const queryParam: GetUserGroupMembersRequest = {
        groupId,
        dataQuery: {
            sortToken: {
                sortCriteria: [
                    {
                        field: 'id',
                        direction: sortDirection,
                    },
                ],
                uniqField: 'id',
            },
            filterToken: { filterCriteria },
        },
    };
    const userGroupMembers: CarbonQueryResult<ListResults<UserGroupMemberView>> = useCarbonEndpoint({
        queryConfig: {
            query: carbonConnector.getUserGroupMembers,
            queryParam: queryParam,
        },
    }, [sortDirection, searchValue]);
    return userGroupMembers;
}
