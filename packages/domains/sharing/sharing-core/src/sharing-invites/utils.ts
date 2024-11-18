import { SharedItemContent } from "@dashlane/communication";
import type { ItemforEmailing } from "@dashlane/sharing";
import {
  convertSharingItemTypeToEmailType,
  getSharingItemTypeFromKW,
} from "../utils/get-sharing-item-type";
import { PendingSharedItemInvite } from "@dashlane/sharing-contracts";
export const getEmailInfoForSharedItem = (
  sharedItemContent: SharedItemContent
): ItemforEmailing => {
  const itemType = getSharingItemTypeFromKW(sharedItemContent);
  const emailItemType = convertSharingItemTypeToEmailType(itemType);
  const name = sharedItemContent.Title;
  return { type: emailItemType, name };
};
export const getEmailInfoForPendingInvite = (
  sharedItemContent: PendingSharedItemInvite
): ItemforEmailing => {
  const emailItemType = sharedItemContent.itemType;
  const name = sharedItemContent.title;
  return { type: emailItemType, name };
};
