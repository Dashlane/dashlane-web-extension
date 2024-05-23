import { usePaginatedEndpoint } from '@dashlane/carbon-api-consumers';
import { CredentialSearchOrder, FilterCriterium, NoteFilterField, NotesFirstTokenParams, NoteSortField, SortCriterium, } from '@dashlane/communication';
import { carbonConnector } from 'src/carbonConnector';
const mapSearchOrderToSortCriterium = (searchOrder: CredentialSearchOrder): SortCriterium<NoteSortField> => {
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
export const useSecureNotesPaginatedEndpoint = (searchValue: string, sortValue: CredentialSearchOrder) => {
    const filterCriteria: FilterCriterium<NoteFilterField>[] = [];
    if (searchValue !== '') {
        filterCriteria.push({
            type: 'matches',
            value: searchValue,
        });
    }
    const tokenQueryParam: NotesFirstTokenParams = {
        sortCriteria: [mapSearchOrderToSortCriterium(sortValue)],
        filterCriteria,
        initialBatchSize: 20,
    };
    return usePaginatedEndpoint({
        batchLiveEndpoint: carbonConnector.liveNotesBatch,
        pageEndpoint: carbonConnector.getNotesPage,
        tokenEndpoint: carbonConnector.getNotesPaginationToken,
        tokenEndpointParam: tokenQueryParam,
    }, [searchValue, sortValue]);
};
