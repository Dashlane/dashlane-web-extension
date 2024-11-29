import { DomainType } from "@dashlane/hermes";
import { WebcardItem } from "@dashlane/autofill-engine/types";
export const createPlaceholderDomain = () => ({
  id: "unknown",
  type: DomainType.Web,
});
export const getSelectedItemPositionForLog = (
  itemsList: WebcardItem[],
  selectedItem: WebcardItem
) => {
  return itemsList.findIndex((item) => item.itemId === selectedItem.itemId) + 1;
};
export const IS_NATIVE_APP = false;
