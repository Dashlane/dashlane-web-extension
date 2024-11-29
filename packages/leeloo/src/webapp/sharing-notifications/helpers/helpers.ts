import {
  CredentialDataQuery,
  NoteDataQuery,
  PendingItemGroup,
  SecretDataQuery,
  SharedItemContent,
} from "@dashlane/communication";
import { ShareableItemType } from "@dashlane/sharing-contracts";
import { SharedItemNotification } from "../types";
const getItemsQuery = (
  itemIds: string[]
): NoteDataQuery | CredentialDataQuery | SecretDataQuery => ({
  filterToken: {
    filterCriteria: [
      {
        field: "id",
        type: "in",
        value: itemIds,
      },
    ],
  },
  sortToken: { sortCriteria: [], uniqField: "id" },
});
export const getItemsToken = (itemIds: string[]): string =>
  btoa(JSON.stringify(getItemsQuery(itemIds)));
export const getItemContent = (
  itemGroup: PendingItemGroup
): SharedItemContent => {
  return itemGroup.items[0];
};
export const getItemIdsByItemType = (
  notifications: SharedItemNotification[],
  type: ShareableItemType
) =>
  notifications.reduce((itemIds, notification) => {
    if (notification.itemGroup.itemType === type) {
      itemIds.push(notification.itemGroup.vaultItemId);
    }
    return itemIds;
  }, [] as string[]);
