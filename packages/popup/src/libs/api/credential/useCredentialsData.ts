import { useCarbonEndpoint } from '@dashlane/carbon-api-consumers';
import { CredentialDataQuery, CredentialFilterField, CredentialSearchOrder, CredentialSortField, FilterCriterium, SortCriterium, } from '@dashlane/communication';
import { carbonConnector } from 'src/carbonConnector';
const mapSearchOrderToSortCriterium = (searchOrder: CredentialSearchOrder): SortCriterium<CredentialSortField> => {
    switch (searchOrder) {
        case CredentialSearchOrder.DATE:
            return {
                field: 'lastUse',
                direction: 'descend',
            };
        case CredentialSearchOrder.NAME:
            return {
                field: 'title',
                direction: 'ascend',
            };
    }
};
export const useCredentialsData = (searchValue: string, sortValue: CredentialSearchOrder) => {
    const filterCriteria: FilterCriterium<CredentialFilterField>[] = [];
    if (searchValue !== '') {
        filterCriteria.push({
            type: 'matches',
            value: searchValue,
        });
    }
    const queryParam: CredentialDataQuery = {
        sortToken: {
            sortCriteria: [mapSearchOrderToSortCriterium(sortValue)],
            uniqField: 'id',
        },
        filterToken: {
            filterCriteria,
        },
    };
    const liveParam = btoa(JSON.stringify(queryParam));
    return useCarbonEndpoint({
        queryConfig: {
            query: carbonConnector.getCredentials,
            queryParam,
        },
        liveConfig: {
            live: carbonConnector.liveCredentials,
            liveParam,
        },
    }, [searchValue, sortValue]);
};
