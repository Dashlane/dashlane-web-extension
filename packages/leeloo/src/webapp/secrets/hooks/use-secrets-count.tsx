import { DataStatus, useCarbonEndpoint } from '@dashlane/carbon-api-consumers';
import { CredentialFilterToken, SecretFilterToken, } from '@dashlane/communication';
import { carbonConnector } from 'libs/carbon/connector';
type FilterToken = CredentialFilterToken & SecretFilterToken;
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
export const useSecretsCount = (currentSpaceId?: string | null): number | null => {
    const result = useCarbonEndpoint({
        queryConfig: {
            query: carbonConnector.getSecretsCount,
            queryParam: {
                filterToken: getItemsCountFilterToken(currentSpaceId),
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
