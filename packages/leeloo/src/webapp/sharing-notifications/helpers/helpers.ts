import { CredentialDataQuery, DataModelType, NoteDataQuery, PendingItemGroup, SecretDataQuery, SharedItemContent, } from '@dashlane/communication';
import { SharedItemNotification } from '../types';
import { getEmailInfoForSharedItem } from './emails';
const getItemsQuery = (itemIds: string[]): NoteDataQuery | CredentialDataQuery | SecretDataQuery => ({
    filterToken: {
        filterCriteria: [
            {
                field: 'id',
                type: 'in',
                value: itemIds,
            },
        ],
    },
    sortToken: { sortCriteria: [], uniqField: 'id' },
});
export const getItemsToken = (itemIds: string[]): string => btoa(JSON.stringify(getItemsQuery(itemIds)));
export const getItemContent = (itemGroup: PendingItemGroup): SharedItemContent => {
    return itemGroup.items[0];
};
export const getItemGroupSharingResponseData = (itemNotifications: SharedItemNotification[]) => {
    return itemNotifications
        .map((notification) => notification.itemGroup)
        .map((itemGroup) => {
        const itemContent = getItemContent(itemGroup);
        return {
            itemGroupId: itemGroup.itemGroupId,
            itemsForEmailing: [getEmailInfoForSharedItem(itemContent)],
        };
    });
};
export const getItemIdsByKwType = (notifications: SharedItemNotification[], kwType: DataModelType) => notifications.reduce((itemIds, notification) => [
    ...itemIds,
    ...notification.itemGroup.items
        .filter((item) => item.kwType === kwType)
        .map((item) => item.Id),
], []);
