import { useCarbonEndpoint } from '@dashlane/carbon-api-consumers';
import { CredentialSearchOrder, FilterCriterium, NoteDataQuery, NoteFilterField, } from '@dashlane/communication';
import { carbonConnector } from 'src/carbonConnector';
export const useSecureNotesCountData = (searchValue: string, sortValue: CredentialSearchOrder) => {
    const filterCriteria: FilterCriterium<NoteFilterField>[] = [];
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
    const queryParam: NoteDataQuery = {
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
            query: carbonConnector.getNotesCount,
            queryParam,
        },
        liveConfig: {
            live: carbonConnector.liveNotesCount,
            liveParam,
        },
    }, [searchValue, sortValue]);
};
