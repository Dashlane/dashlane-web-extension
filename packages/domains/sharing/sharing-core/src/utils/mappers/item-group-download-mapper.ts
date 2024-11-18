import { ItemGroupDownload } from "@dashlane/server-sdk/v1";
import {
  Permission,
  SharedItem,
  SharingUserGroup,
} from "@dashlane/sharing-contracts";
import { crawlForAccessData } from "./crawl-shared-item-access-data";
import { SharedCollectionState } from "../../sharing-collections/data-access/shared-collections.state";
export const toSharedItem = (
  itemGroup: ItemGroupDownload,
  myUserGroups: SharingUserGroup[],
  myCollections: SharedCollectionState[],
  login: string
): SharedItem => {
  const accessData = crawlForAccessData(
    itemGroup,
    login,
    myUserGroups,
    myCollections
  );
  const {
    items,
    revision,
    groupId: sharedItemId,
    groups,
    collections,
    users,
  } = itemGroup;
  const item = items?.[0];
  if (!item) {
    throw new Error("No items associated with item group");
  }
  const { itemId, itemKey } = item;
  const isLastAdmin =
    accessData?.permission === Permission.Admin && !accessData.otherAdminsFound;
  return {
    permission: accessData?.permission ?? Permission.Limited,
    accessLink: accessData?.link,
    itemId,
    itemKey,
    sharedItemId,
    revision,
    isLastAdmin,
    recipientIds: {
      userIds: users?.map(({ userId }) => userId) ?? null,
      collectionIds: collections?.map(({ uuid }) => uuid) ?? null,
      userGroupIds: groups?.map(({ groupId }) => groupId) ?? null,
    },
  };
};
