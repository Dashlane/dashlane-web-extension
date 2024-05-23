import { DataStatus, useCarbonEndpoint } from '@dashlane/carbon-api-consumers';
import { CredentialFilterToken, NoteFilterToken, SecretFilterToken, } from '@dashlane/communication';
import { carbonConnector } from 'libs/carbon/connector';
type FilterToken = CredentialFilterToken & NoteFilterToken;
const getShareableItemsCountFilterToken = (currentSpaceId?: string | null): FilterToken => {
    const filterCriteria: FilterToken['filterCriteria'] = [
        {
            field: 'isLimited',
            type: 'equals',
            value: false,
        },
        {
            field: 'hasAttachments',
            type: 'equals',
            value: false,
        },
    ];
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
    filterToken: getShareableItemsCountFilterToken(currentSpaceId),
    sortToken: { sortCriteria: [], uniqField: 'id' },
});
export const useCredentialsCount = (currentSpaceId?: string | null): number | null => {
    const result = useCarbonEndpoint({
        queryConfig: {
            query: carbonConnector.getCredentialsCount,
            queryParam: {
                filterToken: getShareableItemsCountFilterToken(currentSpaceId),
                sortToken: { sortCriteria: [], uniqField: 'id' },
            },
        },
        liveConfig: {
            live: carbonConnector.liveCredentialsCount,
            liveParam: btoa(getItemsCountQueryString(currentSpaceId)),
        },
    }, []);
    return result.status === DataStatus.Success ? result.data : null;
};
export const useShareableNotesCount = (currentSpaceId?: string | null): number | null => {
    const result = useCarbonEndpoint({
        queryConfig: {
            query: carbonConnector.getNotesCount,
            queryParam: {
                filterToken: getShareableItemsCountFilterToken(currentSpaceId),
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
export const useShareableSecretsCount = (currentSpaceId?: string | null): number | null => {
    const filterCriteria: SecretFilterToken['filterCriteria'] = [];
    if (currentSpaceId || currentSpaceId === '') {
        filterCriteria.push({
            field: 'spaceId',
            type: 'equals',
            value: currentSpaceId,
        });
    }
    const result = useCarbonEndpoint({
        queryConfig: {
            query: carbonConnector.getSecretsCount,
            queryParam: {
                filterToken: { filterCriteria },
                sortToken: { sortCriteria: [], uniqField: 'id' },
            },
        },
        liveConfig: {
            live: carbonConnector.liveSecretsCount,
            liveParam: btoa(getItemsCountQueryString(currentSpaceId)),
        },
    }, []);
    return result.status === DataStatus.Success ? result.data : null;
};
