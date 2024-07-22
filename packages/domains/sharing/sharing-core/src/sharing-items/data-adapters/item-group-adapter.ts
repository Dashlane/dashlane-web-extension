import {
  Permission,
  SharedCollection,
  SharedItem,
} from "@dashlane/sharing-contracts";
import { UserGroupDownload } from "@dashlane/server-sdk/v1";
import { ItemGroup } from "../../sharing-common/sharing.types";
import { crawlForAccessData } from "./crawl-item-group-access-data";
export const toSharedItem = (
  itemGroup: ItemGroup,
  allUserGroups: UserGroupDownload[],
  allCollections: SharedCollection[],
  login: string
): SharedItem => {
  const { link, permission, otherAdminsFound } = crawlForAccessData(
    itemGroup,
    login,
    allUserGroups,
    allCollections
  );
  if (!link) {
    throw new Error("No access to a requested shared item");
  }
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
  const isLastAdmin = permission === Permission.Admin && !otherAdminsFound;
  return {
    permission: permission,
    accessLink: link,
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
