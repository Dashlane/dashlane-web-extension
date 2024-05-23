import { useCarbonEndpoint } from '@dashlane/carbon-api-consumers';
import { CredentialDataQuery, CredentialFilterField, CredentialSearchOrder, FilterCriterium, } from '@dashlane/communication';
import { carbonConnector } from 'src/carbonConnector';
export const useCredentialsCountData = (searchValue: string, sortValue: CredentialSearchOrder) => {
    const filterCriteria: FilterCriterium<CredentialFilterField>[] = [];
    if (searchValue !== '') {
        try {
            const encodedSearchValue = encodeURIComponent(searchValue);
            filterCriteria.push({
                type: 'matches',
                value: encodedSearchValue,
            });
        }
        catch (e) {
        }
    }
    const queryParam: CredentialDataQuery = {
        sortToken: {
            sortCriteria: [],
            uniqField: 'id',
        },
        filterToken: {
            filterCriteria,
        },
    };
    const liveParam = btoa(JSON.stringify(queryParam));
    return useCarbonEndpoint({
        queryConfig: {
            query: carbonConnector.getCredentialsCount,
            queryParam,
        },
        liveConfig: {
            live: carbonConnector.liveCredentialsCount,
            liveParam,
        },
    }, [searchValue, sortValue]);
};
