import { DataStatus, useCarbonEndpoint } from '@dashlane/carbon-api-consumers';
import { CredentialFilterToken, NoteFilterToken, } from '@dashlane/communication';
import { carbonConnector } from 'libs/carbon/connector';
type FilterToken = CredentialFilterToken & NoteFilterToken;
const getItemsCountFilterToken = (currentSpaceId?: string | null): FilterToken => {
    const filterCriteria: FilterToken['filterCriteria'] = [];
    if (currentSpaceId || currentSpaceId === '') {
        filterCriteria.push({
            field: 'spaceId',
            type: 'equals',
            value: currentSpaceId,
        });
    }
    return { filterCriteria };
};
const getItemsCountQueryString = (currentSpaceId?: string | null): string => JSON.stringify({
    filterToken: getItemsCountFilterToken(currentSpaceId),
    sortToken: { sortCriteria: [], uniqField: 'id' },
});
export const useNotesCount = (currentSpaceId?: string | null): number | null => {
    const result = useCarbonEndpoint({
        queryConfig: {
            query: carbonConnector.getNotesCount,
            queryParam: {
                filterToken: getItemsCountFilterToken(currentSpaceId),
                sortToken: { sortCriteria: [], uniqField: 'id' },
            },
        },
        liveConfig: {
            live: carbonConnector.liveNotesCount,
            liveParam: btoa(getItemsCountQueryString(currentSpaceId)),
        },
    }, []);
    return result.status === DataStatus.Success ? result.data : null;
};
