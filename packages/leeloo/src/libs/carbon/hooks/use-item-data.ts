import { CarbonEndpointResult, useCarbonEndpoint, } from '@dashlane/carbon-api-consumers';
import { DataModelItemView, DataQuery, ListResults, SortDirection, } from '@dashlane/communication';
import { Slot } from 'ts-event-bus';
const pidCryptUtil = require('vendor/pidcrypt/pidcrypt_util.js');
interface UseDataOptions<Q extends DataQuery<string, string> = DataQuery<'id' | 'lastUse', 'spaceId'>> {
    spaceId?: string | null;
    filterQuery?: string | null;
    limit?: number;
    uniqField?: Q['sortToken']['uniqField'];
    sort?: Q['sortToken']['sortCriteria'][0]['field'];
    sortDirection?: SortDirection;
    additionalFilters?: Q['filterToken']['filterCriteria'];
}
export const useData = <D extends DataModelItemView = DataModelItemView, Q extends DataQuery<string, string> = DataQuery<'id' | 'lastUse', 'spaceId'>>(queryFn: Slot<Q, ListResults<D>>, liveFn?: Slot<ListResults<D>> | null, { spaceId = null, filterQuery = null, limit, uniqField = 'id', sort = 'lastUse', sortDirection = 'ascend', additionalFilters = [], }: UseDataOptions<Q> = {}): CarbonEndpointResult<ListResults<D>> => {
    const filterCriteria: Q['filterToken']['filterCriteria'] = [];
    if (spaceId !== null) {
        filterCriteria.push({
            type: 'equals',
            value: spaceId,
            field: 'spaceId',
        });
    }
    if (filterQuery !== null) {
        filterCriteria.push({
            type: 'matches',
            value: filterQuery,
        });
    }
    filterCriteria.push(...additionalFilters.filter((filter) => {
        if (filter.type === 'matches' || filter.field === 'spaceId') {
            return false;
        }
        return true;
    }));
    const queryParam: DataQuery<string, string> = {
        filterToken: {
            filterCriteria,
        },
        sortToken: {
            sortCriteria: [
                {
                    field: sort,
                    direction: sortDirection,
                },
            ],
            uniqField,
        },
        limit,
    };
    const liveParam = pidCryptUtil.encodeBase64(JSON.stringify(queryParam), true);
    return useCarbonEndpoint({
        queryConfig: {
            query: queryFn,
            queryParam,
        },
        liveConfig: liveFn
            ? {
                live: liveFn,
                liveParam,
            }
            : undefined,
    }, [spaceId, filterQuery, limit]);
};
