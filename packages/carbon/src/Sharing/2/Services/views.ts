import { curry } from "ramda";
import { MemberPermission, SharingData } from "@dashlane/communication";
import { NotShared, SharingStatusDetail } from "Sharing/2/Services/types";
import {
  doesUserReceiveItemGroupViaGroup,
  getRecipientsCount,
  isUserLastAdmin,
} from "Sharing/2/Services/SharingHelpers";
import { findItemItemGroup } from "Sharing/2/Services/itemGroupHelpers";
export const getNotShared = (): NotShared => ({ isShared: false });
const getMemberPermission = (
  limitedSharedItems: {
    [id: string]: boolean;
  },
  itemId: string
): MemberPermission => (limitedSharedItems[itemId] ? "limited" : "admin");
export const getSharingStatusDetail = curry(
  (
    limitedSharedItems: {
      [id: string]: boolean;
    },
    sharingData: SharingData,
    userId: string,
    itemId: string
  ): SharingStatusDetail => {
    const { itemGroups, userGroups } = sharingData;
    const itemGroup = findItemItemGroup(itemId, itemGroups);
    if (!itemGroup) {
      return getNotShared();
    }
    const recipientsCount = getRecipientsCount(sharingData, itemId);
    const groupSharing = doesUserReceiveItemGroupViaGroup(
      itemGroup,
      userGroups,
      userId
    );
    const lastAdmin = isUserLastAdmin(itemGroup, userId);
    return {
      groupSharing,
      isShared: true,
      lastAdmin,
      permission: getMemberPermission(limitedSharedItems, itemId),
      recipientsCount,
    };
  }
);
