import { SharedItemContent } from "@dashlane/communication";
import type { ItemforEmailing } from "@dashlane/sharing";
import {
  convertSharingItemTypeToEmailType,
  getSharingItemTypeFromKW,
} from "../utils/get-sharing-item-type";
export const getEmailInfoForSharedItem = (
  sharedItemContent: SharedItemContent
): ItemforEmailing => {
  const itemType = getSharingItemTypeFromKW(sharedItemContent);
  const emailItemType = convertSharingItemTypeToEmailType(itemType);
  const name = sharedItemContent.Title;
  return { type: emailItemType, name };
};
