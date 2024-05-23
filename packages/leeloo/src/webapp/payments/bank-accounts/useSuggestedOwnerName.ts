import { CarbonEndpointResult, DataStatus, } from '@dashlane/carbon-api-consumers';
import { IdentityItemView, ListResults } from '@dashlane/communication';
import { carbonConnector } from 'libs/carbon/connector';
import { useData } from 'libs/carbon/hooks/use-item-data';
const getName = (identitiesResult: CarbonEndpointResult<ListResults<IdentityItemView>>): string => {
    if (identitiesResult.status === DataStatus.Success &&
        identitiesResult.data.matchingCount > 0) {
        const { firstName, lastName } = identitiesResult.data.items
            .filter(Boolean)
            .find((item) => item.firstName.trim() !== '' || item.lastName.trim() !== '') ?? { firstName: '', lastName: '' };
        return [firstName, lastName].join(' ').trim();
    }
    return '';
};
export const useSuggestedOwnerName = (spaceId: string | null): string => getName(useData(carbonConnector.getIdentities, carbonConnector.liveIdentities, {
    spaceId,
    sort: 'lastUse',
    sortDirection: 'descend',
}));
