import { safeCast } from "@dashlane/framework-types";
import {
  Permission,
  RecipientType,
  SharedAccess,
  SharedAccessEntry,
  SharedAccessMember,
  SharedCollection,
  SharedItem,
  Status,
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
const checkStatus = ({ status }: { status?: Status }) =>
  status && ![Status.Refused, Status.Revoked].includes(status);
export const toSharedAccess = (itemGroup: ItemGroup): SharedAccess => {
  return {
    users:
      itemGroup.users?.reduce((acc, user) => {
        if (checkStatus(user)) {
          acc.push({
            id: user.userId,
            name: user.alias,
            permission: user.permission,
            status: user.status,
          });
        }
        return acc;
      }, safeCast<SharedAccessEntry[]>([])) ?? [],
    userGroups:
      itemGroup.groups?.reduce((acc, group) => {
        if (checkStatus(group)) {
          acc.push({
            id: group.groupId,
            name: group.name,
            permission: group.permission,
            status: group.status,
          });
        }
        return acc;
      }, safeCast<SharedAccessEntry[]>([])) ?? [],
    collections:
      itemGroup.collections?.reduce((acc, collection) => {
        if (checkStatus(collection)) {
          acc.push({
            id: collection.uuid,
            name: collection.name,
            permission: collection.permission,
            status: collection.status,
          });
        }
        return acc;
      }, safeCast<SharedAccessEntry[]>([])) ?? [],
  };
};
export const toSharedAccessMember = (
  member: SharedAccessEntry,
  type: RecipientType
): SharedAccessMember => ({
  permission: member.permission,
  status: member.status,
  recipientId: member.id,
  recipientName: member.name,
  recipientType: type,
});
