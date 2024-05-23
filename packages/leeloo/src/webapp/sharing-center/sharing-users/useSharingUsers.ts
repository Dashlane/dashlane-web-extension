import { CarbonQueryResult, useCarbonEndpoint, } from '@dashlane/carbon-api-consumers';
import { ListResults, SharingUserDataQuery, SharingUserDataQueryRequest, SharingUserView, SortDirection, } from '@dashlane/communication';
import { carbonConnector } from 'libs/carbon/connector';
export function useSharingUsers(sortDirection: SortDirection, spaceId: string | null): CarbonQueryResult<ListResults<SharingUserView>> {
    const queryParam: SharingUserDataQuery = {
        sortToken: {
            sortCriteria: [
                {
                    field: 'id',
                    direction: sortDirection,
                },
            ],
            uniqField: 'id',
        },
        filterToken: { filterCriteria: [] },
    };
    const request: SharingUserDataQueryRequest = {
        dataQuery: queryParam,
        spaceId: spaceId,
    };
    const liveParam = btoa(JSON.stringify(request));
    const sharingUsers = useCarbonEndpoint({
        queryConfig: {
            query: carbonConnector.getSharingUsers,
            queryParam: request,
        },
        liveConfig: {
            live: carbonConnector.liveSharingUsers,
            liveParam,
        },
    }, [sortDirection, spaceId]);
    return sharingUsers;
}
