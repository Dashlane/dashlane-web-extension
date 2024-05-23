import { useCarbonEndpoint } from '@dashlane/carbon-api-consumers';
import { CredentialDataQuery, CredentialFilterField, FilterCriterium, } from '@dashlane/communication';
import { carbonConnector } from 'libs/carbon/connector';
export const useCredentialsCountData = (spaceId: string | null) => {
    const spaceIdFilterCriteria: FilterCriterium<CredentialFilterField>[] = spaceId === null
        ? []
        : [
            {
                field: 'spaceId',
                value: spaceId,
                type: 'equals',
            },
        ];
    const queryParam: CredentialDataQuery = {
        filterToken: {
            filterCriteria: spaceIdFilterCriteria,
        },
        sortToken: { sortCriteria: [], uniqField: 'id' },
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
    }, [spaceId]);
};
